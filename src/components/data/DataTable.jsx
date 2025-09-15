import React, { useState, useCallback, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  LinearProgress,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  GetApp,
  ExpandMore,
  ExpandLess,
  FilterList,
  Search,
  Refresh,
} from '@mui/icons-material';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Data Table',
  loading = false,
  error = null,
  selectable = false,
  expandable = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onExport,
  onRefresh,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  stickyHeader = true,
  maxHeight = 600,
  emptyMessage = 'No data available',
  customActions = [],
  enableColumnResize = false,
  enableRowDetails = false,
  rowDetailsComponent: RowDetailsComponent,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [quickFilter, setQuickFilter] = useState('');
  const [columnWidths, setColumnWidths] = useState({});

  // Quick filter data
  const filteredData = useMemo(() => {
    if (!quickFilter) return data;
    
    const filterLower = quickFilter.toLowerCase();
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.field];
        return String(value).toLowerCase().includes(filterLower);
      })
    );
  }, [data, quickFilter, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Selection handlers
  const handleSelectAll = useCallback((event) => {
    if (event.target.checked) {
      setSelected(filteredData.map((_, index) => index));
    } else {
      setSelected([]);
    }
  }, [filteredData]);

  const handleSelectRow = useCallback((index) => {
    setSelected(prev => {
      const newSelected = [...prev];
      const selectedIndex = newSelected.indexOf(index);
      
      if (selectedIndex === -1) {
        newSelected.push(index);
      } else {
        newSelected.splice(selectedIndex, 1);
      }
      
      return newSelected;
    });
  }, []);

  const isSelected = useCallback((index) => selected.indexOf(index) !== -1, [selected]);

  // Row expansion
  const handleExpandRow = useCallback((index) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  }, []);

  // Menu handlers
  const handleMenuClick = useCallback((event, row, rowIndex) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedRow({ row, index: rowIndex });
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
    setSelectedRow(null);
  }, []);

  // Pagination handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Cell rendering with type support
  const renderCell = useCallback((row, column) => {
    const value = row[column.field];
    
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'boolean':
        return (
          <Chip
            label={value ? 'Yes' : 'No'}
            color={value ? 'success' : 'default'}
            size="small"
          />
        );
        
      case 'number':
        return (
          <Typography variant="body2" align="right">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        );
        
      case 'currency':
        return (
          <Typography variant="body2" align="right" fontWeight="medium">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(value || 0)}
          </Typography>
        );
        
      case 'date':
        return (
          <Typography variant="body2">
            {value ? new Date(value).toLocaleDateString('id-ID') : '-'}
          </Typography>
        );
        
      case 'datetime':
        return (
          <Typography variant="body2">
            {value ? new Date(value).toLocaleString('id-ID') : '-'}
          </Typography>
        );
        
      case 'status':
        const statusColors = {
          active: 'success',
          inactive: 'default',
          pending: 'warning',
          error: 'error',
          success: 'success',
        };
        return (
          <Chip
            label={value}
            color={statusColors[String(value).toLowerCase()] || 'default'}
            size="small"
          />
        );
        
      case 'progress':
        return (
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={value || 0} />
            <Typography variant="caption" color="text.secondary">
              {value || 0}%
            </Typography>
          </Box>
        );
        
      case 'avatar':
        return (
          <Box
            component="img"
            src={value}
            alt="Avatar"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        );
        
      case 'link':
        return (
          <Button
            size="small"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            Link
          </Button>
        );
        
      default:
        if (typeof value === 'string' && value.length > 50) {
          return (
            <Tooltip title={value}>
              <Typography variant="body2" noWrap>
                {value.substring(0, 50)}...
              </Typography>
            </Tooltip>
          );
        }
        return (
          <Typography variant="body2">
            {value ?? '-'}
          </Typography>
        );
    }
  }, []);

  // Table header
  const tableHeader = (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selected.length > 0 && selected.length < filteredData.length}
              checked={filteredData.length > 0 && selected.length === filteredData.length}
              onChange={handleSelectAll}
            />
          </TableCell>
        )}
        
        {expandable && <TableCell />}
        
        {columns.map((column) => (
          <TableCell
            key={column.field}
            align={column.align || 'left'}
            sortDirection={false}
            sx={{
              fontWeight: 'bold',
              width: columnWidths[column.field] || column.width,
              minWidth: column.minWidth || 100,
            }}
          >
            {column.label}
          </TableCell>
        ))}
        
        <TableCell align="center" sx={{ width: 48 }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <Paper elevation={1}>
      {/* Header */}
      <Box p={2} borderBottom={1} borderColor="divider">
        <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Box display="flex" gap={1}>
            {onRefresh && (
              <IconButton onClick={onRefresh} size="small">
                <Refresh />
              </IconButton>
            )}
            {onExport && (
              <Button
                startIcon={<GetApp />}
                onClick={() => onExport(selected.length > 0 
                  ? selected.map(index => filteredData[index]) 
                  : filteredData
                )}
                size="small"
              >
                Export
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Quick Filter */}
        <TextField
          fullWidth
          size="small"
          placeholder="Quick search..."
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && <LinearProgress />}

      {/* Table */}
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader} size="medium">
          {tableHeader}
          
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 
                    (selectable ? 1 : 0) + 
                    (expandable ? 1 : 0) + 
                    1
                  }
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const actualIndex = page * rowsPerPage + rowIndex;
                const isItemSelected = isSelected(actualIndex);
                const isExpanded = expandedRows.has(actualIndex);
                
                return (
                  <React.Fragment key={row.id || actualIndex}>
                    <TableRow
                      hover
                      selected={isItemSelected}
                      onClick={() => onRowClick?.(row, actualIndex)}
                      sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleSelectRow(actualIndex)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                      )}
                      
                      {expandable && (
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(actualIndex);
                            }}
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                      )}
                      
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          align={column.align || 'left'}
                        >
                          {renderCell(row, column)}
                        </TableCell>
                      ))}
                      
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, row, actualIndex)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable Row Details */}
                    {expandable && isExpanded && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            columns.length + 
                            (selectable ? 1 : 0) + 
                            (expandable ? 1 : 0) + 
                            1
                          }
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 2 }}>
                              {RowDetailsComponent ? (
                                <RowDetailsComponent row={row} />
                              ) : (
                                <Typography variant="body2">
                                  Row details for {row.id || actualIndex}
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {onView && (
          <MenuItem
            onClick={() => {
              onView(selectedRow?.row, selectedRow?.index);
              handleMenuClose();
            }}
          >
            <Visibility sx={{ mr: 1 }} />
            View
          </MenuItem>
        )}
        
        {onEdit && (
          <MenuItem
            onClick={() => {
              onEdit(selectedRow?.row, selectedRow?.index);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        
        {customActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick(selectedRow?.row, selectedRow?.index);
              handleMenuClose();
            }}
          >
            {action.icon && React.cloneElement(action.icon, { sx: { mr: 1 } })}
            {action.label}
          </MenuItem>
        ))}
        
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete(selectedRow?.row, selectedRow?.index);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default DataTable;
