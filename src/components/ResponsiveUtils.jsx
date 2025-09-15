import React from 'react';
import { useTheme, useMediaQuery, Box } from '@mui/material';

// Hook for responsive breakpoints
export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    breakpoints: {
      xs: useMediaQuery(theme.breakpoints.only('xs')),
      sm: useMediaQuery(theme.breakpoints.only('sm')),
      md: useMediaQuery(theme.breakpoints.only('md')),
      lg: useMediaQuery(theme.breakpoints.only('lg')),
      xl: useMediaQuery(theme.breakpoints.only('xl')),
    },
  };
};

// Responsive container component
export const ResponsiveContainer = ({
  children,
  mobileProps = {},
  tabletProps = {},
  desktopProps = {},
  ...baseProps
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  let props = { ...baseProps };

  if (isMobile) {
    props = { ...props, ...mobileProps };
  } else if (isTablet) {
    props = { ...props, ...tabletProps };
  } else if (isDesktop) {
    props = { ...props, ...desktopProps };
  }

  return <Box {...props}>{children}</Box>;
};

// Responsive grid helper
export const ResponsiveGrid = ({
  children,
  spacing = 2,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  ...props
}) => {
  const { isMobile, isTablet } = useResponsive();

  let columns = desktopColumns;
  if (isMobile) columns = mobileColumns;
  else if (isTablet) columns = tabletColumns;

  return (
    <Box display="grid" gridTemplateColumns={`repeat(${columns}, 1fr)`} gap={spacing} {...props}>
      {children}
    </Box>
  );
};

// Show/Hide based on screen size
export const ShowOn = ({ breakpoint, children }) => {
  const theme = useTheme();

  const shouldShow = useMediaQuery(
    breakpoint === 'mobile'
      ? theme.breakpoints.down('md')
      : breakpoint === 'tablet'
        ? theme.breakpoints.between('md', 'lg')
        : breakpoint === 'desktop'
          ? theme.breakpoints.up('lg')
          : breakpoint === 'small'
            ? theme.breakpoints.down('sm')
            : theme.breakpoints.up(breakpoint)
  );

  return shouldShow ? children : null;
};

export const HideOn = ({ breakpoint, children }) => {
  const theme = useTheme();

  const shouldHide = useMediaQuery(
    breakpoint === 'mobile'
      ? theme.breakpoints.down('md')
      : breakpoint === 'tablet'
        ? theme.breakpoints.between('md', 'lg')
        : breakpoint === 'desktop'
          ? theme.breakpoints.up('lg')
          : breakpoint === 'small'
            ? theme.breakpoints.down('sm')
            : theme.breakpoints.up(breakpoint)
  );

  return shouldHide ? null : children;
};

export default useResponsive;
