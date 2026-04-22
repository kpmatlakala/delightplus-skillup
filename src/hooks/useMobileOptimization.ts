/**
 * Mobile Optimization Hooks
 * Specifically designed for mature learners (60+) using mobile devices
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to detect mobile device and orientation
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    orientation,
    screenSize,
    isSmallScreen: screenSize.width < 375, // Very small phones
    isLargeScreen: screenSize.width > 414   // Large phones/small tablets
  };
};

/**
 * Hook for managing font size preferences for mature users
 */
export const useFontSizePreference = () => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>(() => {
    const saved = localStorage.getItem('cet-font-size');
    return (saved as any) || 'large'; // Default to large for mature users
  });

  const updateFontSize = useCallback((size: 'normal' | 'large' | 'extra-large') => {
    setFontSize(size);
    localStorage.setItem('cet-font-size', size);
    
    // Apply to document root for global effect
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${size}`);
  }, []);

  useEffect(() => {
    updateFontSize(fontSize);
  }, [fontSize, updateFontSize]);

  const getFontSizeClass = useCallback(() => {
    switch (fontSize) {
      case 'normal': return 'text-base';
      case 'large': return 'text-lg';
      case 'extra-large': return 'text-xl';
      default: return 'text-lg';
    }
  }, [fontSize]);

  const getButtonSize = useCallback(() => {
    return fontSize === 'extra-large' ? 'lg' : 'default';
  }, [fontSize]);

  return {
    fontSize,
    setFontSize: updateFontSize,
    getFontSizeClass,
    getButtonSize
  };
};

/**
 * Hook for managing touch interactions optimized for mature users
 */
export const useTouchOptimization = () => {
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isLongPress, setIsLongPress] = useState(false);

  const handleTouchStart = useCallback(() => {
    setTouchStartTime(Date.now());
    setIsLongPress(false);
  }, []);

  const handleTouchEnd = useCallback((callback?: () => void) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // Consider it a long press if held for more than 500ms
    if (touchDuration > 500) {
      setIsLongPress(true);
    } else if (callback) {
      // Regular tap
      callback();
    }
  }, [touchStartTime]);

  // Prevent accidental double-taps
  const [lastTapTime, setLastTapTime] = useState(0);
  const handleSafeTap = useCallback((callback: () => void, delay = 300) => {
    const now = Date.now();
    if (now - lastTapTime > delay) {
      setLastTapTime(now);
      callback();
    }
  }, [lastTapTime]);

  return {
    handleTouchStart,
    handleTouchEnd,
    handleSafeTap,
    isLongPress
  };
};

/**
 * Hook for voice input optimization
 */
export const useVoiceInput = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Optimize for mature users
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-ZA'; // South African English
      recognitionInstance.maxAlternatives = 1;
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!recognition || isListening) return;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isSupported,
    isListening,
    startListening,
    stopListening
  };
};

/**
 * Hook for text-to-speech functionality
 */
export const useTextToSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  }) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optimize for mature users - slower, clearer speech
    utterance.rate = options?.rate || 0.8;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    utterance.lang = options?.lang || 'en-ZA';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    speak,
    stop
  };
};

/**
 * Hook for managing mobile keyboard behavior
 */
export const useMobileKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // If height decreased by more than 150px, assume keyboard is open
      setIsKeyboardOpen(heightDifference > 150);
      setViewportHeight(currentHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isKeyboardOpen,
    viewportHeight,
    keyboardHeight: window.innerHeight - viewportHeight
  };
};

/**
 * Hook for managing offline functionality
 */
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasBeenOffline) {
        // Could trigger sync of offline data here
        console.log('Back online - syncing data...');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasBeenOffline]);

  return {
    isOnline,
    hasBeenOffline
  };
};

/**
 * Hook for managing battery-conscious features
 */
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);
          setIsLowBattery(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryInfo();
        
        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
      });
    }
  }, []);

  // Suggest power-saving features when battery is low
  const shouldReduceAnimations = isLowBattery;
  const shouldReducePolling = isLowBattery;

  return {
    batteryLevel,
    isCharging,
    isLowBattery,
    shouldReduceAnimations,
    shouldReducePolling
  };
};