# Design Document

## Overview

This design document outlines the comprehensive improvements to the assessment submission system in the CET Connect Portal. The solution addresses critical issues in file upload reliability, error handling, user experience, data validation, and backend integrity. The design focuses on creating a robust, user-friendly assessment submission flow while maintaining security and data integrity.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   Monitoring    │
│   Components    │◄──►│   Backend        │◄──►│   & Alerts      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Local Storage   │    │ Storage Bucket   │    │ Audit Logs     │
│ (Draft Saves)   │    │ (Files)          │    │ (Submissions)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Architecture

```
AssessmentSubmissionSystem
├── ErrorHandlingService
│   ├── UploadErrorHandler
│   ├── ValidationErrorHandler
│   └── NetworkErrorHandler
├── FileUploadService
│   ├── PathValidator
│   ├── FileNameSanitizer
│   └── StorageManager
├── ProfileDataService
│   ├── ProfileValidator
│   ├── PhoneValidator
│   └── DataFetcher
├── ProgressTrackingService
│   ├── DraftManager
│   ├── NavigationGuard
│   └── SubmissionTracker
└── AuditService
    ├── SubmissionLogger
    ├── DataCleanup
    └── MonitoringIntegration
```

## Components and Interfaces

### 1. Enhanced Error Handling System

#### UploadErrorHandler Interface
```typescript
interface UploadErrorHandler {
  handlePermissionError(error: StorageError): UserFriendlyError;
  handleQuotaError(error: StorageError): UserFriendlyError;
  handleNetworkError(error: StorageError): RetryableError;
  logError(error: StorageError, context: UploadContext): void;
}

interface UserFriendlyError {
  message: string;
  actionable: boolean;
  suggestedAction?: string;
  contactInfo?: string;
}

interface RetryableError extends UserFriendlyError {
  retryable: true;
  retryDelay: number;
  maxRetries: number;
}
```

#### Error Classification System
```typescript
enum ErrorType {
  PERMISSION_DENIED = 'permission_denied',
  QUOTA_EXCEEDED = 'quota_exceeded',
  NETWORK_ERROR = 'network_error',
  INVALID_PATH = 'invalid_path',
  INVALID_FILE = 'invalid_file',
  VALIDATION_ERROR = 'validation_error'
}

interface ErrorContext {
  userId: string;
  moduleId: string;
  fileName: string;
  fileSize: number;
  timestamp: Date;
  userAgent: string;
}
```

### 2. Secure File Upload System

#### PathValidator Service
```typescript
interface PathValidator {
  validateUserId(userId: string): ValidationResult;
  validateModuleId(moduleId: string): ValidationResult;
  sanitizeFileName(fileName: string): string;
  generateSecurePath(userId: string, moduleId: string, fileName: string): string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}
```

#### Storage Security Policies
```sql
-- RLS Policy for assessment submissions
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'assessment-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own submissions" ON storage.objects
FOR SELECT USING (
  bucket_id = 'assessment-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Profile Data Management

#### ProfileDataService Interface
```typescript
interface ProfileDataService {
  fetchValidatedProfile(userId: string): Promise<ValidatedProfile>;
  validatePhoneNumber(phone: string): PhoneValidationResult;
  handleProfileError(error: ProfileError): ProfileErrorResponse;
}

interface ValidatedProfile {
  fullName: string;
  idNumber: string;
  phone: string;
  department: string;
  school: string;
  isComplete: boolean;
  missingFields: string[];
}

interface PhoneValidationResult {
  isValid: boolean;
  formattedPhone?: string;
  error?: string;
  suggestion?: string;
}
```

#### Centralized Phone Validation Utility
```typescript
// src/utils/phoneValidation.ts
export class PhoneValidator {
  static validate(phone: string): PhoneValidationResult {
    const trimmed = phone.trim();
    
    if (!trimmed) {
      return {
        isValid: false,
        error: 'Phone number is required',
        suggestion: 'Please enter your phone number'
      };
    }
    
    // Remove common formatting characters
    const digitsOnly = trimmed.replace(/[\s\-\(\)\+]/g, '');
    
    // South African phone number validation
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        isValid: false,
        error: 'Invalid phone number length',
        suggestion: 'Please enter a valid South African phone number (10-15 digits)'
      };
    }
    
    // Format for South African numbers
    const formatted = this.formatSouthAfricanNumber(digitsOnly);
    
    return {
      isValid: true,
      formattedPhone: formatted
    };
  }
  
  private static formatSouthAfricanNumber(digits: string): string {
    // Implementation for SA number formatting
    if (digits.startsWith('27')) {
      return `+${digits}`;
    } else if (digits.startsWith('0')) {
      return `+27${digits.substring(1)}`;
    }
    return `+27${digits}`;
  }
}
```

### 4. Enhanced User Experience Components

#### NavigationGuard Component
```typescript
interface NavigationGuard {
  enableGuard(hasUnsavedChanges: boolean): void;
  disableGuard(): void;
  showWarningDialog(): Promise<boolean>;
}

// React Hook for navigation protection
export const useNavigationGuard = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
};
```

#### DraftManager Service
```typescript
interface DraftManager {
  saveDraft(moduleId: string, answers: AssessmentAnswers): void;
  loadDraft(moduleId: string): AssessmentAnswers | null;
  clearDraft(moduleId: string): void;
  hasDraft(moduleId: string): boolean;
}

// Local storage implementation
export class LocalStorageDraftManager implements DraftManager {
  private getKey(moduleId: string): string {
    return `assessment_draft_${moduleId}`;
  }
  
  saveDraft(moduleId: string, answers: AssessmentAnswers): void {
    const draft = {
      answers,
      timestamp: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(this.getKey(moduleId), JSON.stringify(draft));
  }
  
  loadDraft(moduleId: string): AssessmentAnswers | null {
    const stored = localStorage.getItem(this.getKey(moduleId));
    if (!stored) return null;
    
    try {
      const draft = JSON.parse(stored);
      // Check if draft is not too old (e.g., 7 days)
      if (Date.now() - draft.timestamp > 7 * 24 * 60 * 60 * 1000) {
        this.clearDraft(moduleId);
        return null;
      }
      return draft.answers;
    } catch {
      return null;
    }
  }
}
```

### 5. Submission Success Flow

#### SubmissionSuccessHandler
```typescript
interface SubmissionSuccessHandler {
  showSuccessMessage(submission: SubmissionResult): void;
  generateDownloadLink(filePath: string): string;
  sendEmailReceipt(userEmail: string, submission: SubmissionResult): Promise<void>;
}

interface SubmissionResult {
  submissionId: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  moduleId: string;
  userId: string;
}
```

### 6. Mobile Navigation System

#### Responsive Navigation Interface
```typescript
interface MobileNavigationService {
  getAvailableSections(moduleId: string): NavigationSection[];
  navigateToSection(sectionId: string): void;
  getCurrentSection(): NavigationSection | null;
  isAccessible(sectionId: string): boolean;
}

interface NavigationSection {
  id: string;
  title: string;
  type: 'guide' | 'session' | 'quiz' | 'assessment';
  isCompleted: boolean;
  isAccessible: boolean;
  order: number;
}
```

#### Mobile-First Navigation Component
```typescript
// Mobile navigation menu component
interface MobileNavigationMenu {
  sections: NavigationSection[];
  currentSection: string;
  onSectionSelect: (sectionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px'
};

// Touch-friendly sizing
const TOUCH_TARGETS = {
  minSize: '44px',
  spacing: '12px',
  fontSize: {
    mobile: '16px',
    tablet: '14px'
  }
};
```

## Data Models

### Enhanced Database Schema

#### Assessment Submissions Audit Table
```sql
CREATE TABLE cet.assessment_submissions_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE cet.assessment_submissions_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit records" ON cet.assessment_submissions_audit
FOR SELECT USING (cet.get_my_role() = 'admin');
```

#### Enhanced Phone Number Constraints
```sql
-- Add CHECK constraint for phone number validation
ALTER TABLE cet.learners 
ADD CONSTRAINT valid_phone_format 
CHECK (
  phone IS NULL OR 
  (
    length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 10 AND 15 AND
    phone ~ '^[\+]?[0-9\s\-\(\)]+$'
  )
);
```

### Storage Bucket Configuration

#### Assessment Submissions Bucket
```typescript
// Bucket configuration
const bucketConfig = {
  name: 'assessment-submissions',
  public: false,
  allowedMimeTypes: ['text/plain', 'application/pdf'],
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
  pathStructure: 'learner-{userId}/assessments/{moduleId}/{timestamp}-{filename}'
};
```

## Error Handling

### Error Classification and Response Strategy

#### Upload Error Handling Flow
```typescript
class UploadErrorHandler {
  async handleUploadError(error: StorageError, context: UploadContext): Promise<ErrorResponse> {
    // Log error for debugging
    await this.logError(error, context);
    
    switch (error.statusCode) {
      case 403:
        return this.handlePermissionError(error, context);
      case 413:
        return this.handleQuotaError(error, context);
      case 422:
        return this.handleValidationError(error, context);
      default:
        return this.handleGenericError(error, context);
    }
  }
  
  private handlePermissionError(error: StorageError, context: UploadContext): ErrorResponse {
    return {
      type: 'permission_denied',
      userMessage: 'You don\'t have permission to upload files to this location.',
      technicalMessage: error.message,
      suggestedAction: 'Please contact your facilitator for assistance.',
      retryable: false,
      contactInfo: 'facilitator@cetconnect.ac.za'
    };
  }
}
```

### User-Friendly Error Messages

#### Error Message Templates
```typescript
const ERROR_MESSAGES = {
  PERMISSION_DENIED: {
    title: 'Upload Permission Error',
    message: 'You don\'t have permission to upload files to this location.',
    action: 'Contact your facilitator for assistance.',
    icon: 'shield-alert'
  },
  QUOTA_EXCEEDED: {
    title: 'Storage Limit Reached',
    message: 'Your storage quota has been exceeded.',
    action: 'Please contact support to increase your storage limit.',
    icon: 'hard-drive'
  },
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'Unable to upload due to network issues.',
    action: 'Check your internet connection and try again.',
    icon: 'wifi-off',
    retryable: true
  }
};
```

## Testing Strategy

### Unit Testing

#### Test Coverage Areas
1. **Phone Validation Tests**
   - Valid South African phone numbers
   - Invalid formats and edge cases
   - Formatting consistency

2. **File Upload Tests**
   - Path validation and sanitization
   - Error handling scenarios
   - Storage policy enforcement

3. **Profile Data Tests**
   - Data fetching and validation
   - Fallback behavior elimination
   - Error state handling

### Integration Testing

#### Assessment Flow Tests
```typescript
describe('Assessment Submission Flow', () => {
  test('should handle complete submission flow', async () => {
    // Test complete flow from form fill to successful submission
  });
  
  test('should recover from network interruption', async () => {
    // Test draft saving and recovery
  });
  
  test('should prevent unauthorized access', async () => {
    // Test security policies
  });
});
```

### End-to-End Testing

#### Critical User Journeys
1. **Happy Path**: Complete assessment submission
2. **Error Recovery**: Network failure during upload
3. **Data Validation**: Invalid profile data handling
4. **Security**: Unauthorized access attempts

## Monitoring and Alerting

### Metrics to Track

#### Upload Success Metrics
- Upload success rate by user/module
- Average upload time
- Error frequency by type
- Storage usage patterns

#### Alert Conditions
```typescript
const ALERT_CONDITIONS = {
  UPLOAD_FAILURE_RATE: {
    threshold: 0.05, // 5% failure rate
    window: '5m',
    severity: 'warning'
  },
  PERMISSION_ERRORS: {
    threshold: 10, // 10 permission errors
    window: '1h',
    severity: 'critical'
  },
  STORAGE_QUOTA: {
    threshold: 0.9, // 90% storage usage
    window: '1h',
    severity: 'warning'
  }
};
```

### Audit Trail Implementation

#### Submission Logging
```typescript
interface SubmissionAuditLog {
  submissionId: string;
  userId: string;
  moduleId: string;
  fileName: string;
  fileSize: number;
  uploadDuration: number;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'retry';
  errorDetails?: string;
}
```

This design provides a comprehensive solution for improving the assessment submission system while maintaining security, reliability, and user experience standards.