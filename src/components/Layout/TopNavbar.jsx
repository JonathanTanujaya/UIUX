import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Bars3Icon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import { useNavigation } from '../../contexts/NavigationContext';

// Icon mapping
const iconMap = {
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
};

// Color mapping for categories
const colorMap = {
  blue: '#3B82F6',
  indigo: '#6366F1',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
};

const TopNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { activeCategory, setActiveCategory, navigationConfig } =
    useNavigation();

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes and F11 key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Listen for F11 key
    const handleKeyPress = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Mobile menu toggle (placeholder for future drawer integration)
  const handleMenuToggle = () => {
    // Placeholder for mobile drawer functionality
  };

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory === 'dashboard') {
      navigate('/dashboard');
    } else {
      setActiveCategory(newCategory);

      // Navigate to first item in category if exists
      const categoryConfig = navigationConfig[newCategory];
      if (categoryConfig && categoryConfig.items && categoryConfig.items.length > 0) {
        const firstItem = categoryConfig.items[0];
        navigate(firstItem.path);
      }
    }
  };

  // Filter categories for main navigation
  const mainCategories = Object.values(navigationConfig);

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
        {/* Brand & Mobile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleMenuToggle}
              sx={{ mr: 1 }}
              data-testid="mobile-menu-toggle"
            >
              <Bars3Icon className="w-6 h-6" />
            </IconButton>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              <CubeIcon className="w-5 h-5 text-white" />
            </Box>
            {!isMobile && (
              <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'primary.main' }}>Stoir</Box>
            )}
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Tabs
            value={activeCategory}
            onChange={handleCategoryChange}
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minWidth: isMobile ? 80 : 120,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
          >
            {mainCategories.map(category => {
              const IconComponent = iconMap[category.icon];
              const hasItems = category.items && category.items.length > 0;

              return (
                <Tab
                  key={category.id}
                  value={category.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span>{category.label}</span>
                      {hasItems && (
                        <Chip
                          size="small"
                          label={category.items.length}
                          sx={{
                            height: 18,
                            fontSize: '0.75rem',
                            backgroundColor: colorMap[category.color] || colorMap.blue,
                            color: 'white',
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                      )}
                    </Box>
                  }
                  data-testid={`nav-tab-${category.id}`}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Fullscreen Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <IconButton
            onClick={toggleFullscreen}
            sx={{ 
              color: 'primary.main',
              '&:hover': { backgroundColor: 'primary.50' }
            }}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
            data-testid="fullscreen-toggle"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="w-5 h-5" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5" />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
