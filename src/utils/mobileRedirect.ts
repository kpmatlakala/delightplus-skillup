/**
 * Mobile Redirect Utilities
 * Automatically redirects mature users to mobile-optimized pages
 */

/**
 * Detect if user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check screen size
  const screenWidth = window.innerWidth;
  const isMobileScreen = screenWidth < 768;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'mobile', 'webos', 'opera mini'
  ];
  
  const isMobileUserAgent = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobileScreen || (isMobileUserAgent && isTouchDevice);
};

/**
 * Detect if user prefers mobile experience
 * Checks localStorage for user preference
 */
export const prefersMobileExperience = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const preference = localStorage.getItem('cet-mobile-preference');
  
  if (preference === 'mobile') return true;
  if (preference === 'desktop') return false;
  
  // Default to mobile for actual mobile devices
  return isMobileDevice();
};

/**
 * Set user's mobile preference
 */
export const setMobilePreference = (preference: 'mobile' | 'desktop' | 'auto'): void => {
  if (typeof window === 'undefined') return;
  
  if (preference === 'auto') {
    localStorage.removeItem('cet-mobile-preference');
  } else {
    localStorage.setItem('cet-mobile-preference', preference);
  }
};

/**
 * Get mobile-optimized route for a given path
 */
export const getMobileRoute = (path: string): string => {
  const mobileRoutes: Record<string, string> = {
    '/learner/modules/:id/assessment': '/mobile/assessment/:id',
    '/learner/modules/:id': '/mobile/module/:id',
    '/learner': '/mobile/portal',
    '/assessments': '/mobile/assessments',
    '/poe': '/mobile/portfolio'
  };
  
  // Find matching route pattern
  for (const [pattern, mobileRoute] of Object.entries(mobileRoutes)) {
    const regex = new RegExp('^' + pattern.replace(':id', '([^/]+)') + '$');
    const match = path.match(regex);
    
    if (match) {
      let result = mobileRoute;
      // Replace parameters
      match.slice(1).forEach((param, index) => {
        result = result.replace(':id', param);
      });
      return result;
    }
  }
  
  return path; // Return original path if no mobile version exists
};

/**
 * Check if current route has a mobile version
 */
export const hasMobileVersion = (path: string): boolean => {
  const mobileRoute = getMobileRoute(path);
  return mobileRoute !== path;
};

/**
 * Redirect to mobile version if appropriate
 */
export const redirectToMobileIfNeeded = (currentPath: string, navigate: (path: string) => void): boolean => {
  if (!prefersMobileExperience()) return false;
  
  const mobileRoute = getMobileRoute(currentPath);
  if (mobileRoute !== currentPath) {
    navigate(mobileRoute);
    return true;
  }
  
  return false;
};

/**
 * Get device information for analytics/debugging
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      screenWidth: 0,
      screenHeight: 0,
      userAgent: '',
      touchSupport: false,
      orientation: 'unknown'
    };
  }
  
  return {
    isMobile: isMobileDevice(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    touchSupport: 'ontouchstart' in window,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
    platform: navigator.platform,
    language: navigator.language
  };
};

/**
 * Mobile-specific feature detection
 */
export const getMobileCapabilities = () => {
  if (typeof window === 'undefined') {
    return {
      speechRecognition: false,
      speechSynthesis: false,
      vibration: false,
      geolocation: false,
      camera: false,
      battery: false
    };
  }
  
  return {
    speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    speechSynthesis: 'speechSynthesis' in window,
    vibration: 'vibrate' in navigator,
    geolocation: 'geolocation' in navigator,
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    battery: 'getBattery' in navigator,
    serviceWorker: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    webShare: 'share' in navigator
  };
};

/**
 * Age-appropriate mobile optimizations
 * Returns recommended settings for mature users (60+)
 */
export const getMatureUserOptimizations = () => {
  return {
    recommendedFontSize: 'large',
    recommendedButtonSize: 'large',
    enableVoiceInput: true,
    enableTextToSpeech: true,
    reducedAnimations: true,
    highContrast: false, // Let user choose
    simplifiedNavigation: true,
    autoSave: true,
    autoSaveInterval: 1000, // 1 second for frequent saves
    confirmationDialogs: true, // More confirmations for safety
    largerTouchTargets: true,
    reducedCognitiveLload: true
  };
};

/**
 * Check if user needs mobile onboarding
 */
export const needsMobileOnboarding = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hasSeenOnboarding = localStorage.getItem('cet-mobile-onboarding-seen');
  const isMobile = isMobileDevice();
  
  return isMobile && !hasSeenOnboarding;
};

/**
 * Mark mobile onboarding as completed
 */
export const completeMobileOnboarding = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cet-mobile-onboarding-seen', 'true');
  localStorage.setItem('cet-mobile-onboarding-date', new Date().toISOString());
};

/**
 * Get mobile performance recommendations
 */
export const getMobilePerformanceSettings = () => {
  const deviceInfo = getDeviceInfo();
  const isLowEndDevice = deviceInfo.screenWidth < 375 || deviceInfo.pixelRatio < 2;
  
  return {
    reduceAnimations: isLowEndDevice,
    lazyLoadImages: true,
    compressImages: isLowEndDevice,
    limitConcurrentRequests: isLowEndDevice ? 2 : 4,
    enableServiceWorker: true,
    cacheStrategy: isLowEndDevice ? 'minimal' : 'aggressive',
    prefetchNextPage: !isLowEndDevice
  };
};