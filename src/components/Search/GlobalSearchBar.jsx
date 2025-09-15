import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const ICON_MAP = {
  inventory: InventoryIcon,
  people: PeopleIcon,
  business: BusinessIcon,
  receipt: ReceiptIcon,
  shopping_cart: ShoppingCartIcon,
};

const GlobalSearchBar = ({
  onResultSelect,
  placeholder = 'Search anything...',
  size = 'medium',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const anchorRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('globalSearchRecent') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async searchQuery => {
      if (searchQuery.length < 2) {
        setResults(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=30`);
        const data = await response.json();

        if (data.success) {
          setResults(data.data);
        } else {
          console.error('Search failed:', data.message);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Debounced suggestions function
  const debouncedSuggestions = useRef(
    debounce(async searchQuery => {
      if (searchQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await response.json();

        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (error) {
        console.error('Suggestions error:', error);
      }
    }, 200)
  ).current;

  // Handle input change
  const handleInputChange = event => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim()) {
      setLoading(true);
      debouncedSearch(value.trim());
      debouncedSuggestions(value.trim());
    } else {
      setResults(null);
      setSuggestions([]);
      setLoading(false);
    }
  };

  // Handle search focus
  const handleFocus = () => {
    setFocused(true);
    setOpen(true);
  };

  // Handle search blur
  const handleClickAway = () => {
    setOpen(false);
    setFocused(false);
  };

  // Handle result selection
  const handleResultSelect = result => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('globalSearchRecent') || '[]');
    const newRecent = [result, ...recent.filter(r => r.id !== result.id)].slice(0, 10);
    localStorage.setItem('globalSearchRecent', JSON.stringify(newRecent));
    setRecentSearches(newRecent.slice(0, 5));

    // Navigate to deep link
    if (result.deepLink) {
      navigate(result.deepLink);
    }

    // Close search
    setOpen(false);
    setQuery('');

    // Callback
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = event => {
      // Ctrl+K to focus search
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to close
      if (event.key === 'Escape' && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Render result icon
  const renderResultIcon = (iconName, category) => {
    const IconComponent = ICON_MAP[iconName] || InventoryIcon;

    return (
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <IconComponent fontSize="small" />
      </Avatar>
    );
  };

  // Render search results
  const renderResults = () => {
    if (!query && recentSearches.length > 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
            Recent Searches
          </Typography>
          <List dense>
            {recentSearches.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleResultSelect(item)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <ListItemAvatar>
                  <HistoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={item.category}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!results || results.totalResults === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {query ? 'No results found' : 'Start typing to search...'}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {/* Search Summary */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Found {results.totalResults} results in {results.searchTime}
          </Typography>
        </Box>

        {/* Results by Category */}
        {Object.entries(results.categories).map(([categoryName, categoryData]) => (
          <Box key={categoryName}>
            <Box sx={{ px: 2, py: 1, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {categoryName}
                </Typography>
                <Chip
                  label={categoryData.count}
                  size="small"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>

            <List dense>
              {categoryData.items.slice(0, 5).map((item, index) => (
                <ListItem
                  key={`${categoryName}-${index}`}
                  button
                  onClick={() => handleResultSelect(item)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemAvatar>{renderResultIcon(item.icon, item.category)}</ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <TrendingIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', opacity: 0.6 }}
                        />
                      </Box>
                    }
                    secondary={item.subtitle}
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                  />
                </ListItem>
              ))}
            </List>

            {categoryData.hasMore && (
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(query)}&category=${categoryName}`)
                  }
                >
                  View all {categoryData.count} results →
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        {/* Search Input */}
        <Paper
          ref={anchorRef}
          elevation={focused ? 4 : 1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: size === 'large' ? 500 : size === 'medium' ? 350 : 250,
            height: size === 'large' ? 48 : size === 'medium' ? 40 : 36,
            borderRadius: 2,
            border: focused ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdrop: 'blur(10px)',
          }}
        >
          <IconButton sx={{ p: 1 }}>
            <SearchIcon fontSize={size === 'large' ? 'medium' : 'small'} />
          </IconButton>

          <InputBase
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            sx={{
              flex: 1,
              fontSize: size === 'large' ? '1rem' : '0.875rem',
            }}
          />

          {/* Keyboard Shortcut Hint */}
          {!focused && !query && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Chip
                label="Ctrl+K"
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  opacity: 0.6,
                  borderColor: alpha(theme.palette.text.secondary, 0.3),
                }}
              />
            </Box>
          )}

          {/* Clear Button */}
          {query && (
            <IconButton
              size="small"
              onClick={() => {
                setQuery('');
                setResults(null);
                setSuggestions([]);
              }}
              sx={{ mr: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Search Results Popper */}
        <Popper
          open={open && focused}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: theme.zIndex.modal + 1, width: anchorRef.current?.clientWidth }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={8}
                sx={{
                  mt: 0.5,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: 'blur(20px)',
                }}
              >
                {renderResults()}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GlobalSearchBar;
