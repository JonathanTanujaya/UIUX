import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Fab,
  Zoom,
  useScrollTrigger,
  Slide,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowUp,
  Brightness4,
  Brightness7,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';

// Responsive navigation handler
export const useResponsiveLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarWidth(280);
    } else if (isTablet) {
      setSidebarOpen(true);
      setSidebarWidth(240);
    } else {
      setSidebarOpen(true);
      setSidebarWidth(280);
    }
  }, [isMobile, isTablet]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    sidebarOpen,
    setSidebarOpen,
    sidebarWidth,
    setSidebarWidth,
  };
};

// Adaptive navigation bar
export const ResponsiveAppBar = ({ 
  title, 
  onMenuClick, 
  actions = [],
  elevation = 1,
  position = 'fixed' 
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsiveLayout();
  const trigger = useScrollTrigger();

  const slideProps = useSpring({
    transform: trigger && position === 'fixed' ? 'translateY(-100%)' : 'translateY(0%)',
    config: { tension: 300, friction: 30 },
  });

  return (
    <Slide appear={false} direction="down" in={!trigger || position !== 'fixed'}>
      <AppBar 
        position={position} 
        elevation={elevation}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            {actions.map((action, index) => (
              <IconButton key={index} onClick={action.onClick} size="small">
                {action.icon}
              </IconButton>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

// Responsive sidebar/drawer
export const ResponsiveSidebar = ({ 
  open, 
  onClose, 
  children, 
  width = 280,
  variant = 'temporary' 
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsiveLayout();

  const drawerVariant = isMobile ? 'temporary' : variant;
  const drawerProps = {
    anchor: 'left',
    open,
    onClose,
    variant: drawerVariant,
    sx: {
      width,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
        ...(drawerVariant === 'persistent' && {
          position: 'relative',
          transform: open ? 'translateX(0)' : `translateX(-${width}px)`,
          transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      },
    },
  };

  return (
    <Drawer {...drawerProps}>
      {children}
    </Drawer>
  );
};

// Adaptive container with responsive padding
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg', 
  disableGutters = false,
  spacing = 2 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        py: spacing,
        px: isMobile ? 1 : spacing,
      }}
    >
      {children}
    </Container>
  );
};

// Responsive grid system
export const ResponsiveGrid = ({ 
  children, 
  spacing = 2, 
  breakpoints = { xs: 12, sm: 6, md: 4, lg: 3 } 
}) => {
  const theme = useTheme();
  
  return (
    <Box
      display="grid"
      gap={spacing}
      sx={{
        gridTemplateColumns: {
          xs: `repeat(${12 / breakpoints.xs}, 1fr)`,
          sm: `repeat(${12 / breakpoints.sm}, 1fr)`,
          md: `repeat(${12 / breakpoints.md}, 1fr)`,
          lg: `repeat(${12 / breakpoints.lg}, 1fr)`,
        },
      }}
    >
      {children}
    </Box>
  );
};

// Scroll to top button
export const ScrollToTop = ({ threshold = 100 }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold,
  });

  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="small"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

// Adaptive text sizing
export const ResponsiveText = ({ 
  variant = 'body1', 
  children, 
  responsive = true,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!responsive) {
    return (
      <Typography variant={variant} {...props}>
        {children}
      </Typography>
    );
  }

  const responsiveVariants = {
    h1: isMobile ? 'h3' : 'h1',
    h2: isMobile ? 'h4' : 'h2',
    h3: isMobile ? 'h5' : 'h3',
    h4: isMobile ? 'h6' : 'h4',
    h5: isMobile ? 'subtitle1' : 'h5',
    h6: isMobile ? 'subtitle2' : 'h6',
    subtitle1: isMobile ? 'body1' : 'subtitle1',
    subtitle2: isMobile ? 'body2' : 'subtitle2',
  };

  const finalVariant = responsiveVariants[variant] || variant;

  return (
    <Typography variant={finalVariant} {...props}>
      {children}
    </Typography>
  );
};

// Full-screen toggle hook
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};

// Responsive image component
export const ResponsiveImage = ({ 
  src, 
  alt, 
  aspectRatio = '16/9',
  objectFit = 'cover',
  lazy = true,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);

  const imageProps = useSpring({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'scale(1)' : 'scale(1.1)',
    config: { tension: 300, friction: 40 },
  });

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        borderRadius: 1,
        position: 'relative',
        backgroundColor: 'grey.100',
      }}
      {...props}
    >
      <animated.img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoaded(true)}
        style={{
          ...imageProps,
          width: '100%',
          height: '100%',
          objectFit,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

// Adaptive spacing helper
export const useResponsiveSpacing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const spacing = {
    xs: isMobile ? 1 : 2,
    sm: isMobile ? 1.5 : isTablet ? 2 : 3,
    md: isMobile ? 2 : isTablet ? 3 : 4,
    lg: isMobile ? 3 : isTablet ? 4 : 6,
    xl: isMobile ? 4 : isTablet ? 6 : 8,
  };

  return spacing;
};

// Responsive modal/dialog
export const ResponsiveModal = ({ 
  open, 
  onClose, 
  children, 
  maxWidth = 'md',
  fullScreenOnMobile = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = fullScreenOnMobile && isMobile;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          ...(fullScreen && {
            margin: 0,
            width: '100%',
            height: '100%',
            maxHeight: 'none',
          }),
        },
      }}
    >
      {children}
    </Dialog>
  );
};

export default {
  useResponsiveLayout,
  ResponsiveAppBar,
  ResponsiveSidebar,
  ResponsiveContainer,
  ResponsiveGrid,
  ScrollToTop,
  ResponsiveText,
  useFullscreen,
  ResponsiveImage,
  useResponsiveSpacing,
  ResponsiveModal,
};
