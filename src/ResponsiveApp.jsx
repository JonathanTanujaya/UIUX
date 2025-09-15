import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

// Import both apps
import DesktopApp from './App'; // Original app
import MobileApp from './components/mobile/StoreApp'; // New mobile app

const ResponsiveApp = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [userPreference, setUserPreference] = useState(null);

  // Detect mobile device
  const isMobileQuery = useMediaQuery('(max-width:900px)');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    // Check if user has a stored preference
    const storedPreference = localStorage.getItem('stoir-app-mode');
    if (storedPreference) {
      setUserPreference(storedPreference);
      return;
    }

    // Auto-detect mobile device
    const isMobile =
      isMobileQuery ||
      isTouchDevice ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);
  }, [isMobileQuery, isTouchDevice]);

  // Force mobile mode for testing
  const forceMobileMode = () => {
    setUserPreference('mobile');
    localStorage.setItem('stoir-app-mode', 'mobile');
  };

  // Force desktop mode
  const forceDesktopMode = () => {
    setUserPreference('desktop');
    localStorage.setItem('stoir-app-mode', 'desktop');
  };

  // Reset to auto-detect
  const resetToAuto = () => {
    setUserPreference(null);
    localStorage.removeItem('stoir-app-mode');
  };

  // Determine which app to show
  const shouldShowMobile =
    userPreference === 'mobile' || (userPreference === null && isMobileDevice);

  // For development - add mode switcher in console
  if (process.env.NODE_ENV === 'development') {
    window.stoirModeSwitcher = {
      mobile: forceMobileMode,
      desktop: forceDesktopMode,
      auto: resetToAuto,
      current: shouldShowMobile ? 'mobile' : 'desktop',
    };

    // Log instructions
    if (!window.stoirInstructionsLogged) {
      console.log('🏪 Stoir Mode Switcher Available:');
      console.log('- window.stoirModeSwitcher.mobile() - Force mobile mode');
      console.log('- window.stoirModeSwitcher.desktop() - Force desktop mode');
      console.log('- window.stoirModeSwitcher.auto() - Auto-detect mode');
      console.log('- window.stoirModeSwitcher.current - Current mode');
      console.log(`Current mode: ${shouldShowMobile ? 'Mobile' : 'Desktop'}`);
      window.stoirInstructionsLogged = true;
    }
  }

  return shouldShowMobile ? <MobileApp /> : <DesktopApp />;
};

export default ResponsiveApp;
