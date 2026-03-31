import { useEffect, useCallback } from 'react';
import React from 'react';

interface NavigationGuardOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Hook to prevent navigation when there are unsaved changes
 * Provides warning dialog for navigation attempts and beforeunload protection
 */
export const useNavigationGuard = ({ 
  hasUnsavedChanges, 
  message = 'You have unsaved changes. Are you sure you want to leave?' 
}: NavigationGuardOptions) => {
  
  // Handle browser beforeunload event (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Function to show confirmation dialog for programmatic navigation
  const showWarningDialog = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!hasUnsavedChanges) {
        resolve(true);
        return;
      }
      
      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  }, [hasUnsavedChanges, message]);

  // Enable/disable guard programmatically
  const enableGuard = useCallback((enabled: boolean) => {
    // This is handled by the hasUnsavedChanges prop
    // Keeping for interface compatibility
  }, []);

  const disableGuard = useCallback(() => {
    // This is handled by setting hasUnsavedChanges to false
    // Keeping for interface compatibility
  }, []);

  return {
    showWarningDialog,
    enableGuard,
    disableGuard,
    isGuardActive: hasUnsavedChanges
  };
};

/**
 * Higher-order component to wrap components with navigation protection
 */
export function withNavigationGuard<P extends object>(
  Component: React.ComponentType<P>,
  getUnsavedChanges: (props: P) => boolean,
  message?: string
) {
  return (props: P) => {
    const hasUnsavedChanges = getUnsavedChanges(props);
    
    useNavigationGuard({ 
      hasUnsavedChanges, 
      message 
    });
    
    return <Component {...props} />;
  };
}