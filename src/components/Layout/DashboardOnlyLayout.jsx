import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationProvider } from '../../contexts/NavigationContext';
import TopNavigation from './TopNavigation';

const DashboardOnlyLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to toggle dark mode throughout the app
  };

  return (
    <NavigationProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Top Navigation Only */}
        <TopNavigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Main Content Area - Full Width */}
        <main className="w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </NavigationProvider>
  );
};

export default DashboardOnlyLayout;
