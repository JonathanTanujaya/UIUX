import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationProvider } from '../../contexts/NavigationContext';
import TopNavigation from './TopNavigation';
import SidebarNavigation from './SidebarNavigation';

const UniversalModernLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to toggle dark mode throughout the app
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <NavigationProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
        {/* Top Navigation Bar */}
        <TopNavigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Main Content Area - No gap */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Sidebar Navigation */}
          <SidebarNavigation />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default UniversalModernLayout;
