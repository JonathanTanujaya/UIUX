import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

const TopNavigation = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCategory, setActiveCategory, navigationConfig } = useNavigation();

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'dashboard') {
      navigate('/dashboard');
    } else {
      setActiveCategory(categoryId);
      
      // Navigate to first item in category if exists
      const categoryConfig = navigationConfig[categoryId];
      if (categoryConfig && categoryConfig.items && categoryConfig.items.length > 0) {
        const firstItem = categoryConfig.items[0];
        navigate(firstItem.path);
      }
    }
  };

  const mainCategories = Object.values(navigationConfig).filter(category => category.id !== 'dashboard');

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: Brand and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Brand - Dashboard Button */}
          <div 
            className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
            onClick={() => navigate('/dashboard')}
            title="Go to Dashboard"
          >
            Stoir
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
                    : 'text-gray-500 bg-white hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 hover:shadow-sm'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Theme toggle and notifications */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-400 bg-white hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-sm"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-400 bg-white hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-sm"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
