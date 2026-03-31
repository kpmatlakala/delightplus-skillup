import React from 'react';
import { AlertTriangle, Shield, HardDrive, WifiOff, FolderX, FileX, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorResponse, ErrorType } from '@/services/uploadErrorHandler';

interface UploadErrorProps {
  error: ErrorResponse;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ErrorIcons = {
  'shield-alert': Shield,
  'hard-drive': HardDrive,
  'wifi-off': WifiOff,
  'folder-x': FolderX,
  'file-x': FileX,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
};

export function UploadError({ error, onRetry, onDismiss, className }: UploadErrorProps) {
  const IconComponent = ErrorIcons[error.icon as keyof typeof ErrorIcons] || AlertCircle;
  
  const getAlertVariant = (errorType: ErrorType) => {
    switch (errorType) {
      case ErrorType.PERMISSION_DENIED:
      case ErrorType.QUOTA_EXCEEDED:
        return 'destructive';
      case ErrorType.NETWORK_ERROR:
      case ErrorType.VALIDATION_ERROR:
        return 'default';
      default:
        return 'destructive';
    }
  };

  return (
    <Alert variant={getAlertVariant(error.type)} className={className}>
      <IconComponent className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>{getErrorTitle(error.type)}</span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-1 hover:bg-transparent"
          >
            ×
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{error.userMessage}</p>
        
        <div className="space-y-2">
          <p className="font-medium text-sm">What you can do:</p>
          <p className="text-sm">{error.suggestedAction}</p>
        </div>

        {error.contactInfo && (
          <div className="text-sm">
            <p className="font-medium">Need help?</p>
            <p>Contact: <a href={`mailto:${error.contactInfo}`} className="underline hover:no-underline">{error.contactInfo}</a></p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {error.retryable && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs"
            >
              Try Again
            </Button>
          )}
          
          {error.contactInfo && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${error.contactInfo}?subject=Assessment Upload Error&body=I encountered an error while uploading my assessment: ${error.userMessage}`, '_blank')}
              className="text-xs"
            >
              Contact Support
            </Button>
          )}
        </div>

        {/* Technical details for debugging (collapsed by default) */}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">Technical Details</summary>
          <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
            <p><strong>Error Type:</strong> {error.type}</p>
            <p><strong>Technical Message:</strong> {error.technicalMessage}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </details>
      </AlertDescription>
    </Alert>
  );
}

function getErrorTitle(errorType: ErrorType): string {
  switch (errorType) {
    case ErrorType.PERMISSION_DENIED:
      return 'Permission Error';
    case ErrorType.QUOTA_EXCEEDED:
      return 'Storage Full';
    case ErrorType.NETWORK_ERROR:
      return 'Connection Problem';
    case ErrorType.INVALID_PATH:
      return 'Invalid Location';
    case ErrorType.INVALID_FILE:
      return 'Invalid File';
    case ErrorType.VALIDATION_ERROR:
      return 'Validation Error';
    default:
      return 'Upload Error';
  }
}

// Hook for managing upload errors with retry logic
export function useUploadError() {
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const showError = (errorResponse: ErrorResponse) => {
    setError(errorResponse);
    setRetryCount(0);
  };

  const retry = () => {
    if (error && error.retryable && error.maxRetries && retryCount < error.maxRetries) {
      setRetryCount(prev => prev + 1);
      return true;
    }
    return false;
  };

  const dismiss = () => {
    setError(null);
    setRetryCount(0);
  };

  const canRetry = error?.retryable && (!error.maxRetries || retryCount < error.maxRetries);

  return {
    error,
    showError,
    retry,
    dismiss,
    canRetry,
    retryCount
  };
}