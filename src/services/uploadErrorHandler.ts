import { StorageError } from '@supabase/storage-js';

// Error types for classification
export enum ErrorType {
  PERMISSION_DENIED = 'permission_denied',
  QUOTA_EXCEEDED = 'quota_exceeded',
  NETWORK_ERROR = 'network_error',
  INVALID_PATH = 'invalid_path',
  INVALID_FILE = 'invalid_file',
  VALIDATION_ERROR = 'validation_error',
  UNKNOWN_ERROR = 'unknown_error'
}

// Context information for error logging
export interface UploadContext {
  userId: string;
  moduleId: string;
  fileName: string;
  fileSize: number;
  timestamp: Date;
  userAgent: string;
  filePath: string;
}

// User-friendly error response
export interface ErrorResponse {
  type: ErrorType;
  userMessage: string;
  technicalMessage: string;
  suggestedAction: string;
  retryable: boolean;
  contactInfo?: string;
  retryDelay?: number;
  maxRetries?: number;
  icon: string;
}

// Error message templates for consistent UX
const ERROR_MESSAGES = {
  [ErrorType.PERMISSION_DENIED]: {
    title: 'Upload Permission Error',
    message: 'You don\'t have permission to upload files to this location.',
    action: 'Please contact your facilitator for assistance with file permissions.',
    icon: 'shield-alert',
    retryable: false,
    contactInfo: 'facilitator@cetconnect.ac.za'
  },
  [ErrorType.QUOTA_EXCEEDED]: {
    title: 'Storage Limit Reached',
    message: 'Your storage quota has been exceeded and the file cannot be uploaded.',
    action: 'Please contact support to increase your storage limit or delete old files.',
    icon: 'hard-drive',
    retryable: false,
    contactInfo: 'support@cetconnect.ac.za'
  },
  [ErrorType.NETWORK_ERROR]: {
    title: 'Connection Problem',
    message: 'Unable to upload due to network connectivity issues.',
    action: 'Check your internet connection and try uploading again.',
    icon: 'wifi-off',
    retryable: true,
    retryDelay: 2000,
    maxRetries: 3
  },
  [ErrorType.INVALID_PATH]: {
    title: 'Invalid File Location',
    message: 'The file path contains invalid characters or structure.',
    action: 'Please try again. If the problem persists, contact support.',
    icon: 'folder-x',
    retryable: false,
    contactInfo: 'support@cetconnect.ac.za'
  },
  [ErrorType.INVALID_FILE]: {
    title: 'Invalid File',
    message: 'The file format or size is not supported for assessment submissions.',
    action: 'Please ensure your file is a text document under 10MB in size.',
    icon: 'file-x',
    retryable: false
  },
  [ErrorType.VALIDATION_ERROR]: {
    title: 'Validation Error',
    message: 'The submission data failed validation checks.',
    action: 'Please check your assessment answers and try submitting again.',
    icon: 'alert-triangle',
    retryable: true
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred during file upload.',
    action: 'Please try again. If the problem persists, contact support.',
    icon: 'alert-circle',
    retryable: true,
    contactInfo: 'support@cetconnect.ac.za'
  }
};

export class UploadErrorHandler {
  /**
   * Main error handling method that classifies and handles upload errors
   */
  async handleUploadError(error: any, context: UploadContext): Promise<ErrorResponse> {
    // Log error for debugging and monitoring
    await this.logError(error, context);
    
    // Classify error based on error properties
    const errorType = this.classifyError(error);
    const template = ERROR_MESSAGES[errorType];
    
    return {
      type: errorType,
      userMessage: template.message,
      technicalMessage: this.extractTechnicalMessage(error),
      suggestedAction: template.action,
      retryable: template.retryable,
      contactInfo: template.contactInfo,
      retryDelay: template.retryDelay,
      maxRetries: template.maxRetries,
      icon: template.icon
    };
  }

  /**
   * Classify error based on status code, message, and other properties
   */
  private classifyError(error: any): ErrorType {
    // Handle Supabase storage errors
    if (error?.statusCode || error?.status) {
      const statusCode = error.statusCode || error.status;
      
      switch (statusCode) {
        case 403:
          return ErrorType.PERMISSION_DENIED;
        case 413:
        case 507:
          return ErrorType.QUOTA_EXCEEDED;
        case 422:
          return ErrorType.VALIDATION_ERROR;
        case 400:
          if (error.message?.includes('path') || error.message?.includes('invalid')) {
            return ErrorType.INVALID_PATH;
          }
          return ErrorType.INVALID_FILE;
        default:
          if (statusCode >= 500) {
            return ErrorType.NETWORK_ERROR;
          }
      }
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || 
        error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        error?.code === 'NETWORK_ERROR') {
      return ErrorType.NETWORK_ERROR;
    }

    // Handle validation errors
    if (error?.message?.includes('validation') ||
        error?.message?.includes('invalid') ||
        error?.name === 'ValidationError') {
      return ErrorType.VALIDATION_ERROR;
    }

    // Handle permission errors
    if (error?.message?.includes('permission') ||
        error?.message?.includes('unauthorized') ||
        error?.message?.includes('forbidden')) {
      return ErrorType.PERMISSION_DENIED;
    }

    // Default to unknown error
    return ErrorType.UNKNOWN_ERROR;
  }

  /**
   * Extract technical error message for logging and debugging
   */
  private extractTechnicalMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    if (error?.details) return error.details;
    if (typeof error === 'string') return error;
    
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error occurred';
    }
  }

  /**
   * Log error with context for monitoring and debugging
   */
  private async logError(error: any, context: UploadContext): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      errorType: this.classifyError(error),
      technicalMessage: this.extractTechnicalMessage(error),
      context: {
        userId: context.userId,
        moduleId: context.moduleId,
        fileName: context.fileName,
        fileSize: context.fileSize,
        filePath: context.filePath,
        userAgent: context.userAgent
      },
      stackTrace: error?.stack || null
    };

    // Log to console for development
    console.error('[UploadErrorHandler] Assessment upload error:', logEntry);

    // In production, you would send this to your monitoring service
    // Example: await this.sendToMonitoring(logEntry);
    
    // Store in local storage for debugging (temporary solution)
    try {
      const existingLogs = JSON.parse(localStorage.getItem('upload_error_logs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 50 error logs to prevent storage bloat
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('upload_error_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.warn('[UploadErrorHandler] Failed to store error log:', storageError);
    }
  }

  /**
   * Get user-friendly error message template by type
   */
  getErrorTemplate(errorType: ErrorType) {
    return ERROR_MESSAGES[errorType];
  }

  /**
   * Check if error is retryable
   */
  isRetryable(errorType: ErrorType): boolean {
    return ERROR_MESSAGES[errorType].retryable;
  }

  /**
   * Get retry configuration for retryable errors
   */
  getRetryConfig(errorType: ErrorType): { delay: number; maxRetries: number } | null {
    const template = ERROR_MESSAGES[errorType];
    if (!template.retryable) return null;
    
    return {
      delay: template.retryDelay || 1000,
      maxRetries: template.maxRetries || 1
    };
  }
}

// Singleton instance for use across the application
export const uploadErrorHandler = new UploadErrorHandler();