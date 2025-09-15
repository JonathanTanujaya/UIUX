import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Chip,
  IconButton,
  Popover,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  History,
  TrendingUp,
  Star,
  StarBorder,
  ArrowForward,
  Category,
  Person,
  Business,
  Inventory,
  Receipt,
  Close,
  Tune,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';

// Advanced search hook with multiple data sources
export const useAdvancedSearch = (dataSources = {}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const debouncedQuery = useDebounce(query, 300);

  // Perform search across multiple data sources
  const performSearch = useCallback(async (searchQuery, searchFilters = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      const searchResults = [];
      
      // Search in each data source
      for (const [sourceKey, sourceData] of Object.entries(dataSources)) {
        if (!sourceData || !Array.isArray(sourceData)) continue;
        
        const filtered = sourceData.filter(item => {
          // Text search
          const searchableText = Object.values(item)
            .join(' ')
            .toLowerCase();
          const queryMatch = searchableText.includes(searchQuery.toLowerCase());
          
          // Apply filters
          const filterMatch = Object.entries(searchFilters).every(([key, value]) => {
            if (!value || value === 'all') return true;
            return item[key] === value;
          });
          
          return queryMatch && filterMatch;
        });
        
        // Add source context to results
        filtered.forEach(item => {
          searchResults.push({
            ...item,
            _source: sourceKey,
            _score: calculateRelevanceScore(item, searchQuery),
          });
        });
      }
      
      // Sort by relevance score
      searchResults.sort((a, b) => b._score - a._score);
      
      setResults(searchResults);
      
      // Add to search history
      if (searchQuery.trim()) {
        setSearchHistory(prev => {
          const newHistory = prev.filter(h => h.query !== searchQuery);
          return [{ query: searchQuery, timestamp: Date.now(), results: searchResults.length }, ...newHistory].slice(0, 10);
        });
      }
      
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [dataSources]);

  // Calculate relevance score
  const calculateRelevanceScore = useCallback((item, searchQuery) => {
    let score = 0;
    const queryLower = searchQuery.toLowerCase();
    
    // Title/name exact match gets high score
    if (item.name?.toLowerCase().includes(queryLower)) score += 10;
    if (item.title?.toLowerCase().includes(queryLower)) score += 10;
    
    // Description match gets medium score
    if (item.description?.toLowerCase().includes(queryLower)) score += 5;
    
    // Other fields get lower score
    Object.values(item).forEach(value => {
      if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
        score += 1;
      }
    });
    
    return score;
  }, []);

  // Generate search suggestions
  const generateSuggestions = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    
    const suggestions = [];
    const queryLower = searchQuery.toLowerCase();
    
    // Get suggestions from all data sources
    Object.entries(dataSources).forEach(([sourceKey, sourceData]) => {
      if (!sourceData || !Array.isArray(sourceData)) return;
      
      sourceData.forEach(item => {
        // Extract potential suggestions from item properties
        ['name', 'title', 'category', 'type', 'tags'].forEach(prop => {
          const value = item[prop];
          if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
            if (!suggestions.includes(value)) {
              suggestions.push(value);
            }
          }
          
          // Handle array values (like tags)
          if (Array.isArray(value)) {
            value.forEach(tag => {
              if (typeof tag === 'string' && tag.toLowerCase().includes(queryLower)) {
                if (!suggestions.includes(tag)) {
                  suggestions.push(tag);
                }
              }
            });
          }
        });
      });
    });
    
    setSuggestions(suggestions.slice(0, 8));
  }, [dataSources]);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, filters);
      generateSuggestions(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery, filters, performSearch, generateSuggestions]);

  return {
    query,
    setQuery,
    results,
    loading,
    filters,
    setFilters,
    searchHistory,
    suggestions,
    recentSearches,
    performSearch,
  };
};

// Smart search component
export const SmartSearch = ({
  dataSources = {},
  placeholder = "Search everything...",
  onResultClick,
  onSaveSearch,
  maxResults = 50,
  enableFilters = true,
  enableHistory = true,
  enableSuggestions = true,
}) => {
  const {
    query,
    setQuery,
    results,
    loading,
    filters,
    setFilters,
    searchHistory,
    suggestions,
  } = useAdvancedSearch(dataSources);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [savedSearches, setSavedSearches] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const searchRef = useRef(null);

  // Group results by source
  const groupedResults = useMemo(() => {
    const grouped = {};
    results.forEach(result => {
      const source = result._source || 'general';
      if (!grouped[source]) {
        grouped[source] = [];
      }
      grouped[source].push(result);
    });
    return grouped;
  }, [results]);

  // Available filter options
  const filterOptions = useMemo(() => {
    const options = {};
    
    Object.values(dataSources).forEach(sourceData => {
      if (!Array.isArray(sourceData)) return;
      
      sourceData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (['category', 'type', 'status', 'priority'].includes(key)) {
            if (!options[key]) options[key] = new Set();
            options[key].add(item[key]);
          }
        });
      });
    });
    
    // Convert sets to arrays
    Object.keys(options).forEach(key => {
      options[key] = Array.from(options[key]).filter(Boolean);
    });
    
    return options;
  }, [dataSources]);

  // Get source icon
  const getSourceIcon = (source) => {
    const icons = {
      customers: <Person />,
      suppliers: <Business />,
      products: <Inventory />,
      transactions: <Receipt />,
      categories: <Category />,
    };
    return icons[source] || <Category />;
  };

  // Get source label
  const getSourceLabel = (source) => {
    const labels = {
      customers: 'Customers',
      suppliers: 'Suppliers', 
      products: 'Products',
      transactions: 'Transactions',
      categories: 'Categories',
    };
    return labels[source] || source;
  };

  // Handle result click
  const handleResultClick = (result) => {
    onResultClick?.(result);
    setOpen(false);
  };

  // Handle save search
  const handleSaveSearch = () => {
    if (query.trim()) {
      const savedSearch = {
        id: Date.now(),
        query,
        filters,
        timestamp: Date.now(),
        resultCount: results.length,
      };
      setSavedSearches(prev => [savedSearch, ...prev].slice(0, 10));
      onSaveSearch?.(savedSearch);
    }
  };

  // Render search results
  const renderResults = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (results.length === 0 && query) {
      return (
        <Box p={2} textAlign="center">
          <Typography color="text.secondary">
            No results found for "{query}"
          </Typography>
          <Button
            size="small"
            onClick={handleSaveSearch}
            sx={{ mt: 1 }}
          >
            Save this search
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        {Object.entries(groupedResults).map(([source, sourceResults]) => (
          <Box key={source} mb={2}>
            <Box display="flex" alignItems="center" gap={1} px={2} py={1}>
              {getSourceIcon(source)}
              <Typography variant="subtitle2" color="primary">
                {getSourceLabel(source)}
              </Typography>
              <Badge badgeContent={sourceResults.length} color="primary" />
            </Box>
            
            <List dense>
              {sourceResults.slice(0, 5).map((result, index) => (
                <ListItem
                  key={`${source}-${index}`}
                  button
                  onClick={() => handleResultClick(result)}
                >
                  <ListItemIcon>
                    {getSourceIcon(source)}
                  </ListItemIcon>
                  <ListItemText
                    primary={result.name || result.title || 'Untitled'}
                    secondary={
                      <Box>
                        {result.description && (
                          <Typography variant="body2" color="text.secondary">
                            {result.description.length > 60
                              ? `${result.description.substring(0, 60)}...`
                              : result.description}
                          </Typography>
                        )}
                        <Box display="flex" gap={0.5} mt={0.5}>
                          {result.tags?.slice(0, 3).map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              
              {sourceResults.length > 5 && (
                <ListItem button>
                  <ListItemText
                    primary={`View all ${sourceResults.length} ${getSourceLabel(source).toLowerCase()}`}
                    sx={{ textAlign: 'center', color: 'primary.main' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        ))}
      </Box>
    );
  };

  // Render suggestions
  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Suggestions
        </Typography>
        <List dense>
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                setQuery(suggestion);
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <Search />
              </ListItemIcon>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  // Render search history
  const renderHistory = () => {
    if (searchHistory.length === 0) return null;

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Recent Searches
        </Typography>
        <List dense>
          {searchHistory.map((historyItem, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                setQuery(historyItem.query);
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText
                primary={historyItem.query}
                secondary={`${historyItem.results} results`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveSearch();
                  }}
                >
                  <BookmarkBorder />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Box>
      <TextField
        ref={searchRef}
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {enableFilters && (
                <IconButton
                  size="small"
                  onClick={(e) => setFilterAnchor(e.currentTarget)}
                >
                  <FilterList />
                </IconButton>
              )}
              {query && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <Clear />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />

      {/* Search Results Popover */}
      <Popover
        open={open && (results.length > 0 || suggestions.length > 0 || searchHistory.length > 0)}
        anchorEl={searchRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { width: searchRef.current?.offsetWidth || 400, maxHeight: 600 }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="fullWidth"
          size="small"
        >
          <Tab label={`Results (${results.length})`} />
          {enableSuggestions && <Tab label="Suggestions" />}
          {enableHistory && <Tab label="History" />}
        </Tabs>

        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {activeTab === 0 && renderResults()}
          {activeTab === 1 && enableSuggestions && renderSuggestions()}
          {activeTab === 2 && enableHistory && renderHistory()}
        </Box>

        {query && (
          <Box p={1} borderTop={1} borderColor="divider">
            <Button
              fullWidth
              size="small"
              startIcon={<Bookmark />}
              onClick={handleSaveSearch}
            >
              Save this search
            </Button>
          </Box>
        )}
      </Popover>

      {/* Filter Menu */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box p={2} minWidth={300}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2}>
            {Object.entries(filterOptions).map(([filterKey, options]) => (
              <Grid item xs={12} key={filterKey}>
                <FormControl fullWidth size="small">
                  <InputLabel>{filterKey}</InputLabel>
                  <Select
                    value={filters[filterKey] || 'all'}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [filterKey]: e.target.value
                    }))}
                    label={filterKey}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {options.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
          
          <Box mt={2} display="flex" gap={1}>
            <Button
              size="small"
              onClick={() => {
                setFilters({});
                setFilterAnchor(null);
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setFilterAnchor(null)}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default {
  useAdvancedSearch,
  SmartSearch,
};
