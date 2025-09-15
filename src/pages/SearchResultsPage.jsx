import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Pagination,
  CircularProgress,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const ICON_MAP = {
  inventory: InventoryIcon,
  people: PeopleIcon,
  business: BusinessIcon,
  receipt: ReceiptIcon,
  shopping_cart: ShoppingCartIcon,
};

const SearchResultsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Fetch search results
  const fetchResults = async (query, category = 'all', page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: 20,
        page: page,
      });

      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`/api/search?${params}`);
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
  };

  // Effect untuk initial load dan URL changes
  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;

    if (query) {
      setCurrentQuery(query);
      setActiveCategory(category);
      setCurrentPage(page);
      fetchResults(query, category, page);
    }
  }, [searchParams]);

  // Handle new search
  const handleSearch = event => {
    event.preventDefault();
    if (currentQuery.trim()) {
      setSearchParams({
        q: currentQuery,
        category: activeCategory,
        page: 1,
      });
    }
  };

  // Handle category filter
  const handleCategoryChange = (event, newCategory) => {
    setActiveCategory(newCategory);
    setSearchParams({
      q: currentQuery,
      category: newCategory,
      page: 1,
    });
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    setSearchParams({
      q: currentQuery,
      category: activeCategory,
      page: page,
    });
  };

  // Handle result click
  const handleResultClick = result => {
    if (result.deepLink) {
      navigate(result.deepLink);
    }
  };

  // Render result icon
  const renderResultIcon = (iconName, category) => {
    const IconComponent = ICON_MAP[iconName] || InventoryIcon;

    return (
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <IconComponent />
      </Avatar>
    );
  };

  // Get all categories from results
  const getCategories = () => {
    if (!results) return [];
    return Object.keys(results.categories);
  };

  // Get filtered results
  const getFilteredResults = () => {
    if (!results) return [];

    if (activeCategory === 'all') {
      // Flatten all categories
      const allResults = [];
      Object.entries(results.categories).forEach(([categoryName, categoryData]) => {
        allResults.push(...categoryData.items);
      });
      return allResults;
    } else {
      return results.categories[activeCategory]?.items || [];
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Search Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SearchIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Search Results
          </Typography>
        </Box>

        {/* Search Input */}
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            value={currentQuery}
            onChange={e => setCurrentQuery(e.target.value)}
            placeholder="Search products, customers, invoices..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
        </form>

        {/* Results Summary */}
        {results && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Found <strong>{results.totalResults}</strong> results for "
              <strong>{results.query}</strong>"
            </Typography>
            <Chip icon={<TimeIcon />} label={results.searchTime} size="small" variant="outlined" />
          </Box>
        )}
      </Paper>

      {/* Category Filters */}
      {results && (
        <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab label="All Results" value="all" />
            {getCategories().map(category => (
              <Tab
                key={category}
                label={`${category} (${results.categories[category].count})`}
                value={category}
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Results */}
      {results && !loading && (
        <Grid container spacing={3}>
          {/* Results List */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              {getFilteredResults().length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                    No results found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Try adjusting your search terms or filters
                  </Typography>
                </Box>
              ) : (
                <List>
                  {getFilteredResults().map((result, index) => (
                    <ListItem
                      key={`${result.category}-${result.id}-${index}`}
                      button
                      onClick={() => handleResultClick(result)}
                      sx={{
                        borderRadius: 1,
                        m: 1,
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemAvatar>
                        {renderResultIcon(result.icon, result.category)}
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {result.title}
                            </Typography>
                            <Chip
                              label={result.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {result.relevanceScore > 75 && (
                              <TrendingIcon sx={{ color: 'success.main', fontSize: 18 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                              {result.subtitle}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {result.matchedFields.map(field => (
                                <Chip
                                  key={field}
                                  label={field}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: theme.palette.info.light,
                                    color: theme.palette.info.contrastText,
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Pagination */}
          {getFilteredResults().length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(results.totalResults / 20)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* No Initial Query */}
      {!searchParams.get('q') && !loading && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>
            Search anything
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Find products, customers, suppliers, invoices, and more...
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default SearchResultsPage;
