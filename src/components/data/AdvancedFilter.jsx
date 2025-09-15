import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  DatePicker,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import {
  FilterList,
  Sort,
  Clear,
  Search,
  DateRange,
  TuneOutlined,
  ViewColumn,
  Download,
} from '@mui/icons-material';

const AdvancedFilter = ({
  data = [],
  columns = [],
  onFilterChange,
  onExport,
  title = 'Advanced Filters',
  enableExport = true,
}) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
  );

  // Filter types based on column data types
  const getFilterType = useCallback((column, values) => {
    if (column.type) return column.type;
    
    const sampleValues = values.slice(0, 10).filter(v => v != null);
    if (sampleValues.every(v => typeof v === 'number')) return 'number';
    if (sampleValues.every(v => !isNaN(Date.parse(v)))) return 'date';
    if (sampleValues.every(v => typeof v === 'boolean')) return 'boolean';
    return 'text';
  }, []);

  // Get unique values for dropdown filters
  const getUniqueValues = useCallback((field) => {
    const values = data.map(item => item[field]).filter(v => v != null);
    return [...new Set(values)].sort();
  }, [data]);

  // Apply all filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([field, filter]) => {
      if (!filter || (Array.isArray(filter) && filter.length === 0)) return;

      const column = columns.find(col => col.field === field);
      const filterType = getFilterType(column, result.map(item => item[field]));

      switch (filterType) {
        case 'number':
          if (filter.min !== undefined && filter.min !== '') {
            result = result.filter(item => Number(item[field]) >= Number(filter.min));
          }
          if (filter.max !== undefined && filter.max !== '') {
            result = result.filter(item => Number(item[field]) <= Number(filter.max));
          }
          break;
          
        case 'date':
          if (filter.from) {
            result = result.filter(item => new Date(item[field]) >= new Date(filter.from));
          }
          if (filter.to) {
            result = result.filter(item => new Date(item[field]) <= new Date(filter.to));
          }
          break;
          
        case 'select':
          if (Array.isArray(filter) && filter.length > 0) {
            result = result.filter(item => filter.includes(item[field]));
          }
          break;
          
        case 'boolean':
          if (filter !== null) {
            result = result.filter(item => Boolean(item[field]) === filter);
          }
          break;
          
        default:
          if (typeof filter === 'string' && filter) {
            result = result.filter(item =>
              String(item[field]).toLowerCase().includes(filter.toLowerCase())
            );
          }
      }
    });

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, filters, searchTerm, sortConfig, columns, getFilterType]);

  // Notify parent component of changes
  React.useEffect(() => {
    onFilterChange?.({
      filteredData,
      filters,
      sortConfig,
      searchTerm,
      columnVisibility,
    });
  }, [filteredData, filters, sortConfig, searchTerm, columnVisibility, onFilterChange]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setSortConfig({ field: '', direction: 'asc' });
  }, []);

  const renderFilterControl = useCallback((column) => {
    const values = data.map(item => item[column.field]);
    const filterType = getFilterType(column, values);
    const currentFilter = filters[column.field];

    switch (filterType) {
      case 'number':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Min"
                type="number"
                value={currentFilter?.min || ''}
                onChange={(e) => handleFilterChange(column.field, {
                  ...currentFilter,
                  min: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Max"
                type="number"
                value={currentFilter?.max || ''}
                onChange={(e) => handleFilterChange(column.field, {
                  ...currentFilter,
                  max: e.target.value
                })}
              />
            </Grid>
          </Grid>
        );

      case 'date':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DatePicker
                label="From"
                value={currentFilter?.from || null}
                onChange={(date) => handleFilterChange(column.field, {
                  ...currentFilter,
                  from: date
                })}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="To"
                value={currentFilter?.to || null}
                onChange={(date) => handleFilterChange(column.field, {
                  ...currentFilter,
                  to: date
                })}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
          </Grid>
        );

      case 'select':
        const uniqueValues = getUniqueValues(column.field);
        return (
          <Autocomplete
            multiple
            size="small"
            options={uniqueValues}
            value={currentFilter || []}
            onChange={(_, value) => handleFilterChange(column.field, value)}
            renderInput={(params) => (
              <TextField {...params} label="Select values" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        );

      case 'boolean':
        return (
          <ToggleButtonGroup
            size="small"
            value={currentFilter}
            exclusive
            onChange={(_, value) => handleFilterChange(column.field, value)}
          >
            <ToggleButton value={true}>True</ToggleButton>
            <ToggleButton value={false}>False</ToggleButton>
          </ToggleButtonGroup>
        );

      default:
        return (
          <TextField
            size="small"
            label="Search"
            value={currentFilter || ''}
            onChange={(e) => handleFilterChange(column.field, e.target.value)}
          />
        );
    }
  }, [data, filters, getFilterType, getUniqueValues, handleFilterChange]);

  const activeFiltersCount = Object.values(filters).filter(f => {
    if (Array.isArray(f)) return f.length > 0;
    if (typeof f === 'object' && f !== null) {
      return Object.values(f).some(v => v !== undefined && v !== '');
    }
    return f !== undefined && f !== '' && f !== null;
  }).length;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <Box display="flex" gap={1}>
          {enableExport && (
            <Button
              startIcon={<Download />}
              onClick={() => onExport?.(filteredData)}
              variant="outlined"
              size="small"
            >
              Export
            </Button>
          )}
          <Button
            startIcon={<Clear />}
            onClick={clearFilters}
            disabled={activeFiltersCount === 0 && !searchTerm}
            size="small"
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Quick Controls */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortConfig.field}
              onChange={(e) => handleSort(e.target.value)}
              label="Sort by"
            >
              {columns.map(column => (
                <MenuItem key={column.field} value={column.field}>
                  {column.label} {sortConfig.field === column.field && 
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Box display="flex" gap={1}>
            <Button
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
              size="small"
            >
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Results Summary */}
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} of {data.length} records
        </Typography>
        
        {activeFiltersCount > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {Object.entries(filters).map(([field, filter]) => {
              if (!filter || (Array.isArray(filter) && filter.length === 0)) return null;
              
              const column = columns.find(col => col.field === field);
              let filterText = '';
              
              if (Array.isArray(filter)) {
                filterText = filter.join(', ');
              } else if (typeof filter === 'object') {
                filterText = Object.entries(filter)
                  .filter(([_, v]) => v !== undefined && v !== '')
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(', ');
              } else {
                filterText = String(filter);
              }
              
              return (
                <Chip
                  key={field}
                  label={`${column?.label || field}: ${filterText}`}
                  onDelete={() => handleFilterChange(field, undefined)}
                  size="small"
                  variant="outlined"
                />
              );
            })}
          </Box>
        )}
      </Box>

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { width: 400, maxHeight: 600, p: 2 } }}
      >
        <Typography variant="h6" gutterBottom>
          Column Filters
        </Typography>
        
        <Grid container spacing={3}>
          {columns.map(column => (
            <Grid item xs={12} key={column.field}>
              <Typography variant="subtitle2" gutterBottom>
                {column.label}
              </Typography>
              {renderFilterControl(column)}
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Paper>
  );
};

export default AdvancedFilter;
