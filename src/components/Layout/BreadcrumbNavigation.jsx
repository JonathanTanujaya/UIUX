import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Box, Chip, useTheme } from '@mui/material';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigation } from '../../contexts/NavigationContext';

const BreadcrumbNavigation = () => {
  const theme = useTheme();
  const location = useLocation();
  const { navigationConfig } = useNavigation();

  // Parse current path to build breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0 || location.pathname === '/dashboard') {
    return null; // Don't show breadcrumb for dashboard
  }

  const breadcrumbItems = [];

  // Add dashboard as root
  breadcrumbItems.push({
    label: 'Dashboard',
    path: '/dashboard',
    isRoot: true,
  });

  // Process path segments
  if (pathSegments.length > 0) {
    const categoryKey = pathSegments[0];
    const category = navigationConfig[categoryKey];

    if (category) {
      // Add category
      breadcrumbItems.push({
        label: category.label,
        path: `/${categoryKey}`,
        isCategory: true,
        color: category.color,
      });

      // Add specific item if exists
      if (pathSegments.length > 1) {
        const itemPath = `/${pathSegments.join('/')}`;
        const item = category.items?.find(item => item.path === itemPath);

        if (item) {
          breadcrumbItems.push({
            label: item.label,
            path: itemPath,
            isItem: true,
          });
        } else {
          // Generic item name from path
          const itemName = pathSegments[pathSegments.length - 1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          breadcrumbItems.push({
            label: itemName,
            path: itemPath,
            isItem: true,
          });
        }
      }
    }
  }

  const handleBreadcrumbClick = item => {
    // For now, we don't navigate on breadcrumb click to avoid conflicts
    // In a real app, you might want to navigate to category overview pages
    console.log('Breadcrumb clicked:', item);
  };

  return (
    <Box
      sx={{
        px: 3,
        py: 1.5,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Breadcrumbs
        separator={<ChevronRightIcon className="w-4 h-4 text-gray-400" />}
        sx={{
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (item.isRoot) {
            return (
              <Link
                key={item.path}
                underline="hover"
                color="inherit"
                href={item.path}
                onClick={e => {
                  e.preventDefault();
                  handleBreadcrumbClick(item);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <HomeIcon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          }

          if (item.isCategory) {
            return (
              <Box key={item.path} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={item.label}
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    backgroundColor: item.color ? `${item.color}.50` : 'primary.50',
                    color: item.color ? `${item.color}.700` : 'primary.700',
                    fontWeight: 500,
                  }}
                />
              </Box>
            );
          }

          if (isLast) {
            return (
              <Typography
                key={item.path}
                color="text.primary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.path}
              underline="hover"
              color="inherit"
              href={item.path}
              onClick={e => {
                e.preventDefault();
                handleBreadcrumbClick(item);
              }}
              sx={{
                fontSize: '0.875rem',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNavigation;
