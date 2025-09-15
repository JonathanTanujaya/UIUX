import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  MagnifyingGlassIcon,
  CommandLineIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useNavigation } from '../../contexts/NavigationContext';

const CommandPalette = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { commandPaletteOpen, setCommandPaletteOpen, searchItems, favoriteItems } = useNavigation();

  // Get search results
  const searchResults = query.trim() ? searchItems(query) : [];

  // Combine favorites for empty query
  const quickAccess = query.trim()
    ? []
    : [...favoriteItems.slice(0, 5).map(item => ({ ...item, type: 'favorite' }))].filter(
        (item, index, self) => index === self.findIndex(t => t.path === item.path)
      );

  const allResults = [...quickAccess, ...searchResults];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, allResults.length]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const handleClose = () => {
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelect = item => {
    if (item.path) {
      navigate(item.path);
    } else if (item.type === 'category') {
      // Navigate to first item in category or category overview
      const firstItem = item.items?.[0];
      if (firstItem) {
        navigate(firstItem.path);
      }
    }
    handleClose();
  };

  const handleKeyDown = e => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : allResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex]);
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  const getItemIcon = item => {
    if (item.type === 'favorite') {
      return <StarIcon className="w-5 h-5 text-yellow-500" />;
    }
    if (item.type === 'recent') {
      return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
    if (item.type === 'category') {
      return (
        <div className="w-5 h-5 bg-primary-100 rounded flex items-center justify-center text-primary-600 text-xs font-bold">
          {item.label.charAt(0)}
        </div>
      );
    }
    // Regular item
    return (
      <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 text-xs font-bold">
        {item.label.charAt(0)}
      </div>
    );
  };

  const getItemSecondary = item => {
    if (item.category) {
      return item.category;
    }
    if (item.type === 'category') {
      return `${item.items?.length || 0} items`;
    }
    return item.path;
  };

  return (
    <Dialog
      open={commandPaletteOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '70vh',
          marginTop: '-20vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Search Input */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              autoFocus
              placeholder="Search for commands, pages, or actions..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />,
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label="ESC"
                      sx={{ height: 24, fontSize: '0.75rem', fontFamily: 'monospace' }}
                    />
                  </Box>
                ),
              }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                  backgroundColor: 'transparent',
                },
              }}
            />
          </Box>

          {/* Results */}
          <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 400 }}>
            {allResults.length === 0 && query.trim() && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CommandLineIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <Typography color="text.secondary">No results found for "{query}"</Typography>
              </Box>
            )}

            {allResults.length === 0 && !query.trim() && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CommandLineIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Type to search or use keyboard shortcuts
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Ctrl+K to open command palette
                  <br />• ↑↓ to navigate • Enter to select
                </Typography>
              </Box>
            )}

            {allResults.length > 0 && (
              <List sx={{ p: 1 }}>
                {/* Quick access section */}
                {!query.trim() && quickAccess.length > 0 && (
                  <>
                    <Typography
                      variant="caption"
                      sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}
                    >
                      Quick Access
                    </Typography>
                    {quickAccess.map((item, index) => (
                      <ListItem key={`quick-${item.path}`} disablePadding>
                        <ListItemButton
                          selected={selectedIndex === index}
                          onClick={() => handleSelect(item)}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.50',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>{getItemIcon(item)}</ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            secondary={getItemSecondary(item)}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                          />
                          <Chip
                            size="small"
                            label={item.type}
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: item.type === 'favorite' ? 'warning.50' : 'info.50',
                              color: item.type === 'favorite' ? 'warning.700' : 'info.700',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}

                    {searchResults.length > 0 && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="caption"
                          sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}
                        >
                          Search Results
                        </Typography>
                      </>
                    )}
                  </>
                )}

                {/* Search results */}
                {searchResults.map((item, index) => {
                  const actualIndex = quickAccess.length + index;
                  return (
                    <ListItem key={`search-${item.path || item.id}`} disablePadding>
                      <ListItemButton
                        selected={selectedIndex === actualIndex}
                        onClick={() => handleSelect(item)}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.50',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>{getItemIcon(item)}</ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          secondary={getItemSecondary(item)}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          size="small"
                          label={item.type || 'item'}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: 'primary.50',
                            color: 'primary.700',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'grey.50',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    size="small"
                    label="↵"
                    sx={{ height: 18, fontSize: '0.7rem', fontFamily: 'monospace' }}
                  />
                  <span>select</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    size="small"
                    label="↑↓"
                    sx={{ height: 18, fontSize: '0.7rem', fontFamily: 'monospace' }}
                  />
                  <span>navigate</span>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {allResults.length} results
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
