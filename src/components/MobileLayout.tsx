/**
 * Mobile-Optimized Layout Component
 * Provides a mobile-first layout with mature user considerations
 */

import React, { ReactNode } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  Menu,
  X,
  Phone,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  useMobileDetection, 
  useFontSizePreference, 
  useOfflineSupport,
  useBatteryOptimization,
  useMobileKeyboard
} from '@/hooks/useMobileOptimization';
import { useTextToSpeech } from '@/hooks/useMobileOptimization';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showHelpButton?: boolean;
  onHelp?: () => void;
  helpPhoneNumber?: string;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title = "CET Connect",
  showBackButton = false,
  onBack,
  showHelpButton = true,
  onHelp,
  helpPhoneNumber,
  className = ""
}) => {
  const { isMobile, orientation, screenSize } = useMobileDetection();
  const { fontSize, setFontSize, getFontSizeClass } = useFontSizePreference();
  const { isOnline, hasBeenOffline } = useOfflineSupport();
  const { batteryLevel, isLowBattery, isCharging } = useBatteryOptimization();
  const { isKeyboardOpen } = useMobileKeyboard();
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('cet-dark-mode');
    return saved === 'true';
  });

  // Apply dark mode
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('cet-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleReadTitle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(`${title}. You are using CET Connect on your mobile device.`);
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
    } else if (helpPhoneNumber) {
      const confirmCall = window.confirm(
        `Do you want to call your facilitator at ${helpPhoneNumber}?`
      );
      if (confirmCall) {
        window.location.href = `tel:${helpPhoneNumber}`;
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${getFontSizeClass()} ${className}`}>
      {/* Status Bar - only show on mobile */}
      {isMobile && showStatusBar && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi size={14} className="text-green-600" />
              ) : (
                <WifiOff size={14} className="text-red-600" />
              )}
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              
              {hasBeenOffline && isOnline && (
                <Badge variant="outline" className="text-xs">
                  Reconnected
                </Badge>
              )}
            </div>

            {/* Battery Status */}
            {batteryLevel !== null && (
              <div className="flex items-center gap-1">
                {isLowBattery ? (
                  <BatteryLow size={14} className="text-red-600" />
                ) : (
                  <Battery size={14} className={isCharging ? 'text-green-600' : 'text-gray-600'} />
                )}
                <span className={isLowBattery ? 'text-red-600' : 'text-gray-600'}>
                  {Math.round(batteryLevel * 100)}%
                </span>
              </div>
            )}

            {/* Hide status bar button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatusBar(false)}
              className="p-1 h-auto"
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}

      {/* Offline Alert */}
      {!isOnline && (
        <Alert className="mx-4 mt-2 border-amber-200 bg-amber-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're offline. Your work will be saved locally and synced when you reconnect.
          </AlertDescription>
        </Alert>
      )}

      {/* Low Battery Alert */}
      {isLowBattery && (
        <Alert className="mx-4 mt-2 border-red-200 bg-red-50">
          <BatteryLow className="h-4 w-4" />
          <AlertDescription>
            Low battery detected. Consider charging your device to avoid losing your work.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              {showBackButton && onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2"
                >
                  ←
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {title}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadTitle}
                  className="p-1"
                  title="Read page title aloud"
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Font size controls */}
              <div className="flex gap-1">
                <Button
                  variant={fontSize === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize('normal')}
                  className="text-xs px-2 py-1"
                >
                  A
                </Button>
                <Button
                  variant={fontSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize('large')}
                  className="text-sm px-2 py-1"
                >
                  A
                </Button>
                <Button
                  variant={fontSize === 'extra-large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize('extra-large')}
                  className="text-base px-2 py-1"
                >
                  A
                </Button>
              </div>

              {/* Dark mode toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2"
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              {/* Help button */}
              {showHelpButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHelp}
                  className="p-2"
                  title="Get help"
                >
                  {helpPhoneNumber ? <Phone size={16} /> : <HelpCircle size={16} />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className={`
          flex-1 
          ${isKeyboardOpen ? 'pb-0' : 'pb-safe-area-inset-bottom'}
          ${isMobile ? 'px-0' : 'px-4'}
        `}
      >
        {children}
      </main>

      {/* Show status bar toggle when hidden */}
      {isMobile && !showStatusBar && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStatusBar(true)}
          className="fixed top-2 right-2 z-30 p-2"
        >
          <Menu size={14} />
        </Button>
      )}

      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="mobile-announcements"
      />
    </div>
  );
};

/**
 * Mobile-optimized card component
 */
interface MobileCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  title,
  subtitle,
  className = "",
  padding = 'medium'
}) => {
  const { fontSize } = useFontSizePreference();
  
  const getPaddingClass = () => {
    const base = {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6'
    }[padding];
    
    // Increase padding for larger font sizes
    if (fontSize === 'extra-large' && padding !== 'none') {
      return base.replace('p-', 'p-').replace(/\d/, (n) => String(Number(n) + 1));
    }
    
    return base;
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-lg 
      border border-gray-200 dark:border-gray-700 
      shadow-sm 
      ${getPaddingClass()} 
      ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Mobile-optimized button component
 */
interface MobileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = "",
  icon,
  fullWidth = false
}) => {
  const { fontSize } = useFontSizePreference();
  
  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
    };
    
    const sizeClasses = {
      small: fontSize === 'extra-large' ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm',
      medium: fontSize === 'extra-large' ? 'px-6 py-4 text-base' : 'px-4 py-3 text-base',
      large: fontSize === 'extra-large' ? 'px-8 py-5 text-lg' : 'px-6 py-4 text-lg'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};