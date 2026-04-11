import { supabase } from '@/integrations/supabase/client';
import { uploadErrorHandler, UploadContext } from './uploadErrorHandler';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

// Upload configuration
export interface UploadConfig {
  bucket: string;
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  pathStructure: string;
}

// Upload result interface
export interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: any;
  errorResponse?: any;
}

// Default configuration for assessment submissions
const DEFAULT_CONFIG: UploadConfig = {
  bucket: 'assessment-submissions',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  pathStructure: 'learner-{userId}/{moduleId}/{timestamp}-{filename}'
};

export class FileUploadService {
  private config: UploadConfig;

  constructor(config: UploadConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Main upload method with comprehensive error handling and validation
   */
  async uploadAssessmentFile(
    content: string | Blob,
    fileName: string,
    userId: string,
    moduleId: string
  ): Promise<UploadResult> {
    try {
      // 1. Validate inputs
      const userValidation = this.validateUserId(userId);
      if (!userValidation.isValid) {
        throw new Error(`Invalid user ID: ${userValidation.error}`);
      }

      const moduleValidation = this.validateModuleId(moduleId);
      if (!moduleValidation.isValid) {
        throw new Error(`Invalid module ID: ${moduleValidation.error}`);
      }

      // 2. Sanitize filename
      const sanitizedFileName = this.sanitizeFileName(fileName);
      
      // 3. Generate secure path (fixed to match storage policy)
      const filePath = this.generateSecurePath(userId, moduleId, sanitizedFileName);
      
      // 4. Prepare upload context for error handling
      const context: UploadContext = {
        userId,
        moduleId,
        fileName: sanitizedFileName,
        fileSize: this.getContentSize(content),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        filePath
      };

      // 5. Validate file size
      if (context.fileSize > this.config.maxFileSize) {
        throw new Error(`File size ${context.fileSize} exceeds maximum allowed size of ${this.config.maxFileSize} bytes`);
      }

      // 6. Prepare content for upload
      const uploadContent = this.prepareContent(content, sanitizedFileName);

      // 7. Perform upload with retry logic
      const uploadResult = await this.performUploadWithRetry(
        filePath,
        uploadContent,
        context
      );

      if (uploadResult.error) {
        const errorResponse = await uploadErrorHandler.handleUploadError(
          uploadResult.error,
          context
        );
        
        return {
          success: false,
          error: uploadResult.error,
          errorResponse
        };
      }

      return {
        success: true,
        filePath,
        fileName: sanitizedFileName
      };

    } catch (error) {
      // Handle validation and preparation errors
      const context: UploadContext = {
        userId: userId || 'unknown',
        moduleId: moduleId || 'unknown',
        fileName: fileName || 'unknown',
        fileSize: this.getContentSize(content),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        filePath: 'unknown'
      };

      const errorResponse = await uploadErrorHandler.handleUploadError(error, context);
      
      return {
        success: false,
        error,
        errorResponse
      };
    }
  }

  /**
   * Submit assessment with file upload and database storage
   * For now, just does file upload until database function is implemented
   */
  async submitAssessment(
    submissionContent: string | Blob,
    moduleId: string,
    userId: string,
    options?: {
      fileName?: string;
      submissionText?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<UploadResult & { submissionId?: string }> {
    try {
      const fallbackExtension = options?.fileName?.split('.').pop()
        || (submissionContent instanceof Blob && submissionContent.type === 'application/pdf' ? 'pdf' : 'txt');
      const fileName = options?.fileName || `assessment_${moduleId}_${Date.now()}.${fallbackExtension}`;

      const fileResult = await this.uploadAssessmentFile(
        submissionContent,
        fileName,
        userId,
        moduleId
      );

      if (!fileResult.success) {
        return {
          success: false,
          error: fileResult.error,
          errorResponse: fileResult.errorResponse
        };
      }

      const submissionText = options?.submissionText
        ?? (typeof submissionContent === 'string'
          ? submissionContent
          : `File upload submission: ${fileName}\nSubmitted: ${new Date().toISOString()}`);

      const submissionId = `temp_${Date.now()}`;
      const submittedAt = new Date().toISOString();

      // The current supported path is storage upload + learner_progress update.
      // Some deployed databases do not yet expose `cet_submit_assessment`, so we
      // avoid calling it here to prevent noisy 400 errors during learner submission.
      try {
        const { error: progressError } = await supabase
          .from('learner_progress')
          .upsert({
            user_id: userId,
            module_unit_standard_id: moduleId,
            assessment_submitted: true,
            assessment_submitted_at: submittedAt,
            assessment_unlocked: true,
            submission_path: fileResult.filePath,
            submission_uploaded_at: submittedAt,
            updated_at: submittedAt
          }, {
            onConflict: 'user_id,module_unit_standard_id'
          });

        if (progressError) {
          console.warn('Failed to update learner progress:', progressError);
        }
      } catch (progressError) {
        console.warn('Failed to update learner progress:', progressError);
      }

      return {
        success: true,
        filePath: fileResult.filePath,
        fileName: fileResult.fileName,
        submissionId
      };

    } catch (error) {
      const context: UploadContext = {
        userId,
        moduleId,
        fileName: options?.fileName || `assessment_${moduleId}.txt`,
        fileSize: this.getContentSize(submissionContent),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        filePath: 'unknown'
      };

      const errorResponse = await uploadErrorHandler.handleUploadError(error, context);
      
      return {
        success: false,
        error,
        errorResponse
      };
    }
  }

  /**
   * Validate user ID format (should be UUID)
   */
  validateUserId(userId: string): ValidationResult {
    if (!userId || typeof userId !== 'string') {
      return {
        isValid: false,
        error: 'User ID is required and must be a string'
      };
    }

    // UUID v4 regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(userId)) {
      return {
        isValid: false,
        error: 'User ID must be a valid UUID format'
      };
    }

    return { isValid: true };
  }

  /**
   * Validate module ID format
   */
  validateModuleId(moduleId: string): ValidationResult {
    if (!moduleId || typeof moduleId !== 'string') {
      return {
        isValid: false,
        error: 'Module ID is required and must be a string'
      };
    }

    // Allow alphanumeric, hyphens, and underscores
    const moduleIdRegex = /^[a-zA-Z0-9_-]+$/;
    
    if (!moduleIdRegex.test(moduleId)) {
      return {
        isValid: false,
        error: 'Module ID contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed'
      };
    }

    if (moduleId.length > 50) {
      return {
        isValid: false,
        error: 'Module ID is too long (maximum 50 characters)'
      };
    }

    return { isValid: true };
  }

  /**
   * Sanitize filename to remove forbidden characters and ensure safety
   */
  sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== 'string') {
      return `assessment_${Date.now()}.txt`;
    }

    // Remove or replace forbidden characters
    let sanitized = fileName
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // Replace forbidden chars with underscore
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // Ensure filename is not empty after sanitization
    if (!sanitized) {
      sanitized = `assessment_${Date.now()}`;
    }

    // Ensure reasonable length (max 100 characters before extension)
    const parts = sanitized.split('.');
    const name = parts.slice(0, -1).join('.');
    const extension = parts.length > 1 ? parts[parts.length - 1] : 'txt';
    
    const truncatedName = name.length > 100 ? name.substring(0, 100) : name;
    
    return `${truncatedName}.${extension}`;
  }

  /**
   * Generate secure file path that matches existing storage policies
   * Format: learner-{userId}/{moduleId}-{timestamp}-{filename}
   */
  generateSecurePath(userId: string, moduleId: string, fileName: string): string {
    const timestamp = Date.now();
    
    // Generate path that matches existing storage policy: learner-{userId}/...
    return `learner-${userId}/${moduleId}-${timestamp}-${fileName}`;
  }

  /**
   * Get content size for validation
   */
  private getContentSize(content: string | Blob): number {
    if (content instanceof Blob) {
      return content.size;
    }
    // Estimate string size in bytes (UTF-8)
    return new Blob([content]).size;
  }

  /**
   * Prepare content for upload (convert string to Blob if needed)
   */
  private prepareContent(content: string | Blob, fileName: string): Blob {
    if (content instanceof Blob) {
      return content;
    }
    
    // Determine MIME type based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    let mimeType = 'text/plain';
    
    switch (extension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'txt':
      case 'md':
        mimeType = 'text/plain';
        break;
      default:
        mimeType = 'text/plain';
    }

    return new Blob([content], { type: mimeType });
  }

  /**
   * Perform upload with retry logic for network errors
   */
  private async performUploadWithRetry(
    filePath: string,
    content: Blob,
    context: UploadContext,
    retryCount: number = 0
  ): Promise<{ error?: any }> {
    try {
      const { error } = await supabase.storage
        .from(this.config.bucket)
        .upload(filePath, content, { 
          upsert: true,
          contentType: content.type
        });

      if (error) {
        // Check if this is a retryable error
        const errorType = uploadErrorHandler['classifyError'](error);
        const retryConfig = uploadErrorHandler.getRetryConfig(errorType);
        
        if (retryConfig && retryCount < retryConfig.maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryConfig.delay));
          
          // Retry the upload
          return this.performUploadWithRetry(filePath, content, context, retryCount + 1);
        }
        
        return { error };
      }

      return {};
    } catch (error) {
      // Handle network errors with retry
      if (retryCount < 3 && this.isNetworkError(error)) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.performUploadWithRetry(filePath, content, context, retryCount + 1);
      }
      
      return { error };
    }
  }

  /**
   * Check if error is a network-related error
   */
  private isNetworkError(error: any): boolean {
    return error?.name === 'NetworkError' ||
           error?.message?.includes('network') ||
           error?.message?.includes('fetch') ||
           error?.code === 'NETWORK_ERROR';
  }

  /**
   * Generate download URL for uploaded file
   */
  async getDownloadUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(this.config.bucket)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Failed to generate download URL:', error);
      return null;
    }
  }

  /**
   * Check if file exists in storage
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.config.bucket)
        .list(filePath.split('/').slice(0, -1).join('/'));
      
      if (error) return false;
      
      const fileName = filePath.split('/').pop();
      return data?.some(file => file.name === fileName) || false;
    } catch {
      return false;
    }
  }
}

// Singleton instance for use across the application
export const fileUploadService = new FileUploadService();