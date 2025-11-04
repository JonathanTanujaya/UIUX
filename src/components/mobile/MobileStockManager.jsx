import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fab,
  Alert,
  Skeleton,
  Grid,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  Search,
  FilterList,
  QrCodeScanner,
  Add,
  Edit,
  Visibility,
  Warning,
  CheckCircle,
  Error,
  Sort,
  GridView,
  ViewList,
  Refresh,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useIntersectionObserver } from 'react-intersection-observer';
import { FixedSizeList as VirtualizedList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import MobileBarcodeScanner from './MobileBarcodeScanner';

const MobileStockManager = ({ onAddProduct, onEditProduct, onViewProduct, onScanBarcode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [error, setError] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  // Pull-to-refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullThreshold = 80;

  // Refs
  const listRef = useRef();
  const containerRef = useRef();
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'books', label: 'Books' },
    { value: 'tools', label: 'Tools' },
    { value: 'sports', label: 'Sports' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'stock_low', label: 'Low Stock First' },
    { value: 'stock_high', label: 'High Stock First' },
    { value: 'price_low', label: 'Price (Low-High)' },
    { value: 'price_high', label: 'Price (High-Low)' },
    { value: 'updated', label: 'Recently Updated' },
  ];

  // Load products
  const loadProducts = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError('');

      // Load mock product data immediately
      
      // Mock product data
      const mockProducts = Array.from({ length: 20 }, (_, index) => ({
        id: (pageNum - 1) * 20 + index + 1,
        name: `Product ${(pageNum - 1) * 20 + index + 1}`,
        barcode: `12345${String((pageNum - 1) * 20 + index + 1).padStart(5, '0')}`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].value,
        stock: Math.floor(Math.random() * 100),
        minStock: 10,
        price: (Math.random() * 100 + 10).toFixed(2),
        image: `https://picsum.photos/200/200?random=${(pageNum - 1) * 20 + index + 1}`,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      if (append) {
        setProducts(prev => [...prev, ...mockProducts]);
      } else {
        setProducts(mockProducts);
      }

      setHasNextPage(pageNum < 5); // Simulate 5 pages max
    } catch (error) {
      setError('Failed to load products. Please try again.');
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.barcode.includes(searchQuery)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'stock_low':
          return a.stock - b.stock;
        case 'stock_high':
          return b.stock - a.stock;
        case 'price_low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'updated':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Pull-to-refresh handlers
  const handleTouchStart = e => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = e => {
    if (!isPulling || containerRef.current?.scrollTop > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    currentYRef.current = e.touches[0].clientY;
    const distance = Math.max(0, currentYRef.current - startYRef.current);
    setPullDistance(Math.min(distance, pullThreshold * 1.5));
  };

  const handleTouchEnd = () => {
    if (isPulling && pullDistance >= pullThreshold) {
      setRefreshing(true);
      loadProducts(1);
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  // Infinite scroll
  const loadMoreItems = useCallback(() => {
    if (!loading && hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  }, [loading, hasNextPage, page, loadProducts]);

  // Check if item is loaded for infinite scroll
  const isItemLoaded = index => index < filteredProducts.length;

  // Get stock status
  const getStockStatus = product => {
    if (product.stock === 0) return { status: 'out', color: 'error', icon: <Error /> };
    if (product.stock <= product.minStock)
      return { status: 'low', color: 'warning', icon: <Warning /> };
    return { status: 'ok', color: 'success', icon: <CheckCircle /> };
  };

  // Handle barcode scan result
  const handleScanResult = result => {
    setSearchQuery(result.text);
    setScannerOpen(false);
  };

  // Product Card Component
  const ProductCard = ({ product, style = {} }) => {
    const stockStatus = getStockStatus(product);

    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            m: 1,
            height: viewMode === 'grid' ? 280 : 120,
            display: 'flex',
            flexDirection: viewMode === 'grid' ? 'column' : 'row',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => onViewProduct(product)}
        >
          {viewMode === 'grid' ? (
            <>
              <Box sx={{ position: 'relative', height: 140 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Chip
                  icon={stockStatus.icon}
                  label={product.stock}
                  color={stockStatus.color}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: `${stockStatus.color}.main`,
                    color: 'white',
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="h6" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {product.barcode}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </>
          ) : (
            <>
              <Avatar src={product.image} sx={{ width: 80, height: 80, m: 2 }} variant="rounded" />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.barcode}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${product.price}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                  >
                    <Chip
                      icon={stockStatus.icon}
                      label={product.stock}
                      color={stockStatus.color}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    );
  };

  // Virtualized List Item
  const VirtualizedItem = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <Skeleton variant="rectangular" height={viewMode === 'grid' ? 280 : 120} sx={{ m: 1 }} />
        </div>
      );
    }

    return <ProductCard product={filteredProducts[index]} style={style} />;
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Search and Controls */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search products or scan barcode..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setScannerOpen(true)}>
                  <QrCodeScanner />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          <Button
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
            variant="outlined"
            size="small"
          >
            Filters
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              {viewMode === 'grid' ? <ViewList /> : <GridView />}
            </IconButton>

            <IconButton
              onClick={() => {
                setRefreshing(true);
                loadProducts(1);
              }}
              disabled={refreshing}
            >
              <Refresh />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Pull-to-refresh indicator */}
      <AnimatePresence>
        {isPulling && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: pullDistance }}
            exit={{ height: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.palette.primary.light,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Refresh
                sx={{
                  transform: `rotate(${pullDistance * 4}deg)`,
                  transition: 'transform 0.1s ease',
                }}
              />
              <Typography variant="body2">
                {pullDistance >= pullThreshold ? 'Release to refresh' : 'Pull to refresh'}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Products List */}
      <Box
        ref={containerRef}
        sx={{ flexGrow: 1, overflow: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredProducts.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={hasNextPage ? filteredProducts.length + 10 : filteredProducts.length}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <VirtualizedList
                ref={ref}
                height={window.innerHeight - 200}
                itemCount={hasNextPage ? filteredProducts.length + 10 : filteredProducts.length}
                itemSize={viewMode === 'grid' ? 300 : 140}
                onItemsRendered={onItemsRendered}
              >
                {VirtualizedItem}
              </VirtualizedList>
            )}
          </InfiniteLoader>
        )}
      </Box>

      {/* Filter Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onOpen={() => setFilterDrawerOpen(true)}
        PaperProps={{
          sx: {
            maxHeight: '80vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters & Sort
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Category
          </Typography>
          <List dense>
            {categories.map(category => (
              <ListItem
                key={category.value}
                button
                selected={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
              >
                <ListItemText primary={category.label} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Sort By
          </Typography>
          <List dense>
            {sortOptions.map(option => (
              <ListItem
                key={option.value}
                button
                selected={sortBy === option.value}
                onClick={() => setSortBy(option.value)}
              >
                <ListItemIcon>
                  <Sort />
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 20,
          right: 20,
        }}
        onClick={onAddProduct}
      >
        <Add />
      </Fab>

      {/* Barcode Scanner */}
      <MobileBarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanResult={handleScanResult}
        title="Scan Product Barcode"
        description="Point camera at product barcode for quick search"
      />
    </Box>
  );
};

export default MobileStockManager;
