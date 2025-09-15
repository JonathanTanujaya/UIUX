import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useNavigation } from '../../contexts/NavigationContext';

// Icon mapping for menu items
const iconMap = {
  // Master Data icons
  TagIcon: () => (
    <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs font-bold">
      K
    </div>
  ),
  CogIcon: () => (
    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
      S
    </div>
  ),
  ExclamationTriangleIcon: () => (
    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
      !
    </div>
  ),
  CheckCircleIcon: () => (
    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
      ✓
    </div>
  ),
  MapPinIcon: () => (
    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
      A
    </div>
  ),
  UserGroupIcon: () => (
    <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-xs font-bold">
      S
    </div>
  ),
  TruckIcon: () => (
    <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs font-bold">
      T
    </div>
  ),
  UsersIcon: () => (
    <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center text-pink-600 text-xs font-bold">
      C
    </div>
  ),
  BuildingLibraryIcon: () => (
    <div className="w-5 h-5 bg-cyan-100 rounded flex items-center justify-center text-cyan-600 text-xs font-bold">
      B
    </div>
  ),
  CreditCardIcon: () => (
    <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">
      R
    </div>
  ),

  // Transaction icons
  ShoppingCartIcon: () => (
    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
      P
    </div>
  ),
  ArrowUturnLeftIcon: () => (
    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
      ←
    </div>
  ),
  CurrencyDollarIcon: () => (
    <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs font-bold">
      $
    </div>
  ),
  ArrowsPointingInIcon: () => (
    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
      ⊕
    </div>
  ),
  ArrowUturnRightIcon: () => (
    <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-orange-600 text-xs font-bold">
      →
    </div>
  ),
  XCircleIcon: () => (
    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
      ✕
    </div>
  ),
  ClipboardDocumentCheckIcon: () => (
    <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs font-bold">
      □
    </div>
  ),
  GiftIcon: () => (
    <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center text-pink-600 text-xs font-bold">
      🎁
    </div>
  ),
  SparklesIcon: () => (
    <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-xs font-bold">
      ✨
    </div>
  ),
  ExclamationCircleIcon: () => (
    <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center text-amber-600 text-xs font-bold">
      !
    </div>
  ),
  ArrowPathIcon: () => (
    <div className="w-5 h-5 bg-cyan-100 rounded flex items-center justify-center text-cyan-600 text-xs font-bold">
      ↻
    </div>
  ),

  // Finance icons
  DocumentCheckIcon: () => (
    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
      ✓
    </div>
  ),
  MagnifyingGlassIcon: () => (
    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
      🔍
    </div>
  ),
  InboxIcon: () => (
    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
      📥
    </div>
  ),
  ClockIcon: () => (
    <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-orange-600 text-xs font-bold">
      ⏰
    </div>
  ),
  PlusCircleIcon: () => (
    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
      +
    </div>
  ),
  MinusCircleIcon: () => (
    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
      -
    </div>
  ),

  // Reports icons
  CubeIcon: () => (
    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
      📦
    </div>
  ),
  IdentificationIcon: () => (
    <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-xs font-bold">
      ID
    </div>
  ),
  ShoppingBagIcon: () => (
    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
      🛍️
    </div>
  ),
  ListBulletIcon: () => (
    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
      •
    </div>
  ),
  BanknotesIcon: () => (
    <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs font-bold">
      💰
    </div>
  ),
  CalculatorIcon: () => (
    <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs font-bold">
      🧮
    </div>
  ),
  ArrowUturnDownIcon: () => (
    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
      ↓
    </div>
  ),
  DocumentDuplicateIcon: () => (
    <div className="w-5 h-5 bg-cyan-100 rounded flex items-center justify-center text-cyan-600 text-xs font-bold">
      📄
    </div>
  ),
  ScaleIcon: () => (
    <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center text-emerald-600 text-xs font-bold">
      ⚖️
    </div>
  ),
  DocumentTextIcon: () => (
    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
      📝
    </div>
  ),
  ScissorsIcon: () => (
    <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-orange-600 text-xs font-bold">
      ✂️
    </div>
  ),
  TrophyIcon: () => (
    <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs font-bold">
      🏆
    </div>
  ),
};

const ContextualSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    items: true,
  });

  const { activeItems, activeCategoryConfig, favoriteItems, toggleFavorite } = useNavigation();

  // Show all items since search is now in TopNavbar
  const filteredItems = activeItems;

  const handleItemClick = item => {
    navigate(item.path);
  };

  const handleSectionToggle = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActiveItem = path => {
    return location.pathname === path;
  };

  const isFavorite = item => {
    return favoriteItems.some(fav => fav.path === item.path);
  };

  const renderMenuItem = (item, showFavorite = true) => {
    const IconComponent = iconMap[item.icon];
    const active = isActiveItem(item.path);
    const favorite = isFavorite(item);

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          selected={active}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.50',
              borderLeft: '3px solid',
              borderLeftColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.100',
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {IconComponent ? (
              <IconComponent />
            ) : (
              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
                {item.label.charAt(0)}
              </div>
            )}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 400,
            }}
          />
          {showFavorite && (
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(item);
              }}
              sx={{
                opacity: favorite ? 1 : 0.5,
                '&:hover': { opacity: 1 },
              }}
            >
              {favorite ? (
                <StarIconSolid className="w-4 h-4 text-yellow-500" />
              ) : (
                <StarIcon className="w-4 h-4" />
              )}
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: activeCategoryConfig?.color
                ? `${activeCategoryConfig.color}.main`
                : 'text.primary',
            }}
          >
            {activeCategoryConfig?.label || 'Navigation'}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {/* Favorite Items */}
        {favoriteItems.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <ListItemButton
              onClick={() => handleSectionToggle('favorites')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <StarIcon className="w-4 h-4" />
              </ListItemIcon>
              <ListItemText
                primary="Favorites"
                primaryTypographyProps={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              />
              <Badge badgeContent={favoriteItems.length} color="primary" sx={{ mr: 1 }} />
              {expandedSections.favorites ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </ListItemButton>
            <Collapse in={expandedSections.favorites}>
              <List sx={{ pl: 1 }}>{favoriteItems.map(item => renderMenuItem(item, false))}</List>
            </Collapse>
          </Box>
        )}

        {/* Divider if we have favorites */}
        {favoriteItems.length > 0 && <Divider sx={{ my: 1 }} />}

        {/* Main Items */}
        {filteredItems.length > 0 && (
          <Box>
            <ListItemButton
              onClick={() => handleSectionToggle('items')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemText
                primary={`All ${activeCategoryConfig?.label || 'Items'}`}
                primaryTypographyProps={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              />
              <Chip
                size="small"
                label={filteredItems.length}
                sx={{ mr: 1, height: 20, fontSize: '0.75rem' }}
              />
              {expandedSections.items ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </ListItemButton>
            <Collapse in={expandedSections.items}>
              <List>{filteredItems.map(item => renderMenuItem(item))}</List>
            </Collapse>
          </Box>
        )}

        {/* Empty state */}
        {activeItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No items available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default ContextualSidebar;
