import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
  Collapse,
  Button,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Search, ExpandMore, ExpandLess } from '@mui/icons-material';

const ResponsiveDataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  onRowClick = null,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  pageSize = 10,
  className = '',
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  mobileBreakpoint = 'md', // sm, md, lg, xl
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(mobileBreakpoint));
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const toggleRowExpansion = rowId => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Mobile Card View Component
  const MobileCardView = ({ row }) => {
    const isExpanded = expandedRows.has(row.id);
    const visibleCells = row.getVisibleCells();
    const primaryCell = visibleCells[0]; // First column as primary
    const secondaryCell = visibleCells[1]; // Second column as secondary
    const remainingCells = visibleCells.slice(2);

    return (
      <Card
        key={row.id}
        sx={{
          mb: 1,
          cursor: onRowClick ? 'pointer' : 'default',
          '&:hover': onRowClick ? { bgcolor: 'action.hover' } : {},
        }}
        onClick={() => onRowClick && onRowClick(row.original)}
      >
        <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
          {/* Primary Content */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="h6" component="div" noWrap>
              {flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
            </Typography>
            {remainingCells.length > 0 && (
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  toggleRowExpansion(row.id);
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>

          {/* Secondary Content */}
          {secondaryCell && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {flexRender(secondaryCell.column.columnDef.cell, secondaryCell.getContext())}
            </Typography>
          )}

          {/* Expanded Content */}
          <Collapse in={isExpanded}>
            <Box sx={{ pt: 1 }}>
              {remainingCells.map((cell, index) => (
                <Box
                  key={cell.id}
                  sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {cell.column.columnDef.header}:
                  </Typography>
                  <Typography variant="body2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Desktop Table View Component
  const DesktopTableView = () => (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  sortDirection={
                    header.column.getIsSorted()
                      ? header.column.getIsSorted() === 'desc'
                        ? 'desc'
                        : 'asc'
                      : false
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {enableSorting && header.column.getCanSort() && (
                      <IconButton size="small" onClick={header.column.getToggleSortingHandler()}>
                        {header.column.getIsSorted() === 'desc' ? (
                          <ArrowDownward fontSize="small" />
                        ) : header.column.getIsSorted() === 'asc' ? (
                          <ArrowUpward fontSize="small" />
                        ) : null}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              hover={!!onRowClick}
              onClick={() => onRowClick && onRowClick(row.original)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{loadingMessage}</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* Search/Filter */}
      {enableFiltering && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
        </Box>
      )}

      {/* Responsive Content */}
      {isMobile ? (
        <Box>
          {table.getRowModel().rows.map(row => (
            <MobileCardView key={row.id} row={row} />
          ))}
        </Box>
      ) : (
        <DesktopTableView />
      )}

      {/* Pagination */}
      {enablePagination && (
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={pagination.pageSize}
          page={pagination.pageIndex}
          onPageChange={(event, newPage) =>
            setPagination(prev => ({ ...prev, pageIndex: newPage }))
          }
          onRowsPerPageChange={event =>
            setPagination(prev => ({
              ...prev,
              pageSize: parseInt(event.target.value, 10),
              pageIndex: 0,
            }))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          showFirstButton
          showLastButton
        />
      )}
    </Box>
  );
};

export default ResponsiveDataTable;
