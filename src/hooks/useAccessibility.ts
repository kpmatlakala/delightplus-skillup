/**
 * Accessibility Hooks and Utilities
 * Provides keyboard navigation, screen reader support, and focus management
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing focus within a component
 */
export const useFocusManagement = () => {
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef<number>(-1);

  /**
   * Get all focusable elements within a container
   */
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  /**
   * Set up keyboard navigation within a container
   */
  const setupKeyboardNavigation = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    focusableElementsRef.current = focusableElements;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (focusableElements.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          currentFocusIndexRef.current = Math.min(
            currentFocusIndexRef.current + 1,
            focusableElements.length - 1
          );
          focusableElements[currentFocusIndexRef.current]?.focus();
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          currentFocusIndexRef.current = Math.max(
            currentFocusIndexRef.current - 1,
            0
          );
          focusableElements[currentFocusIndexRef.current]?.focus();
          break;

        case 'Home':
          event.preventDefault();
          currentFocusIndexRef.current = 0;
          focusableElements[0]?.focus();
          break;

        case 'End':
          event.preventDefault();
          currentFocusIndexRef.current = focusableElements.length - 1;
          focusableElements[focusableElements.length - 1]?.focus();
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [getFocusableElements]);

  /**
   * Focus the first focusable element
   */
  const focusFirst = useCallback(() => {
    if (focusableElementsRef.current.length > 0) {
      currentFocusIndexRef.current = 0;
      focusableElementsRef.current[0]?.focus();
    }
  }, []);

  /**
   * Focus the last focusable element
   */
  const focusLast = useCallback(() => {
    if (focusableElementsRef.current.length > 0) {
      currentFocusIndexRef.current = focusableElementsRef.current.length - 1;
      focusableElementsRef.current[currentFocusIndexRef.current]?.focus();
    }
  }, []);

  return {
    setupKeyboardNavigation,
    focusFirst,
    focusLast,
    getFocusableElements
  };
};

/**
 * Hook for managing focus trapping (useful for modals, dialogs)
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const { getFocusableElements } = useFocusManagement();

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;

    // Focus first element
    focusableElements[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, getFocusableElements]);

  return containerRef;
};

/**
 * Hook for screen reader announcements
 */
export const useScreenReader = () => {
  const announcementRef = useRef<HTMLDivElement>(null);

  /**
   * Announce text to screen readers
   */
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      const element = document.createElement('div');
      element.setAttribute('aria-live', priority);
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      element.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      document.body.appendChild(element);
      announcementRef.current = element;
    }

    // Clear previous message and set new one
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);
  }, []);

  /**
   * Announce form validation errors
   */
  const announceError = useCallback((fieldName: string, errorMessage: string) => {
    announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive');
  }, [announce]);

  /**
   * Announce successful actions
   */
  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceError,
    announceSuccess
  };
};

/**
 * Hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifiers = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      };

      // Create shortcut string (e.g., "ctrl+s", "alt+shift+n")
      const shortcutParts = [];
      if (modifiers.ctrl) shortcutParts.push('ctrl');
      if (modifiers.alt) shortcutParts.push('alt');
      if (modifiers.shift) shortcutParts.push('shift');
      if (modifiers.meta) shortcutParts.push('meta');
      shortcutParts.push(key);
      
      const shortcutString = shortcutParts.join('+');

      if (shortcuts[shortcutString]) {
        event.preventDefault();
        shortcuts[shortcutString]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

/**
 * Hook for managing ARIA attributes dynamically
 */
export const useAriaAttributes = () => {
  /**
   * Set ARIA attributes on an element
   */
  const setAriaAttributes = useCallback((
    element: HTMLElement | null,
    attributes: Record<string, string | boolean | number>
  ) => {
    if (!element) return;

    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
      element.setAttribute(ariaKey, String(value));
    });
  }, []);

  /**
   * Remove ARIA attributes from an element
   */
  const removeAriaAttributes = useCallback((
    element: HTMLElement | null,
    attributes: string[]
  ) => {
    if (!element) return;

    attributes.forEach(key => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
      element.removeAttribute(ariaKey);
    });
  }, []);

  return {
    setAriaAttributes,
    removeAriaAttributes
  };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Get animation duration based on user preference
   */
  const getAnimationDuration = useCallback((normalDuration: number) => {
    return prefersReducedMotion ? 0 : normalDuration;
  }, [prefersReducedMotion]);

  /**
   * Check if animations should be disabled
   */
  const shouldReduceMotion = useCallback(() => {
    return prefersReducedMotion;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getAnimationDuration,
    shouldReduceMotion
  };
};