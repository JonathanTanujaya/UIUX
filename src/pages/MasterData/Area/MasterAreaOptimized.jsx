import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { areaAPI } from '../../../services/areaAPI';

const MasterAreaOptimized = () => {
  // States
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('kodearea');
  const [order, setOrder] = useState('asc');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    kodedivisi: 'DIV001', // Default value since it's hidden
    kodearea: '',
    namaarea: '',
    status: 'Aktif'
  });

  const [formErrors, setFormErrors] = useState({});

  // Table columns definition
  const columns = [
    { id: 'kodearea', label: 'Kode Area', minWidth: 120 },
    { id: 'namaarea', label: 'Nama Area', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Aksi', minWidth: 150, disablePadding: true }
  ];

  // Load areas
  const loadAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await areaAPI.getAll();
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setAreas(response.data.data);
        setFilteredAreas(response.data.data);
      } else {
        console.warn('Unexpected area data structure:', response.data);
        setAreas([]);
        setFilteredAreas([]);
      }
    } catch (err) {
      console.error('Error loading areas:', err);
      setError(`Gagal memuat data area: ${err.response?.data?.message || err.message}`);
      setAreas([]);
      setFilteredAreas([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAreas();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredAreas(filtered);
    }
    setPage(0);
  }, [searchTerm, areas]);

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedData = [...filteredAreas].sort((a, b) => {
      const aValue = a[property] || '';
      const bValue = b[property] || '';
      
      if (aValue < bValue) return isAsc ? 1 : -1;
      if (aValue > bValue) return isAsc ? -1 : 1;
      return 0;
    });
    
    setFilteredAreas(sortedData);
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.kodearea.trim()) errors.kodearea = 'Kode area wajib diisi';
    if (!formData.namaarea.trim()) errors.namaarea = 'Nama area wajib diisi';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      kodedivisi: 'DIV001', // Default value since it's hidden
      kodearea: '',
      namaarea: '',
      status: 'Aktif'
    });
    setFormErrors({});
  };

  // CRUD operations
  const handleAdd = () => {
    resetForm();
    setEditMode(false);
    setSelectedArea(null);
    setOpenDialog(true);
  };

  const handleEdit = (area) => {
    setFormData({
      kodedivisi: area.kodedivisi || '',
      kodearea: area.kodearea || '',
      namaarea: area.namaarea || '',
      status: area.status || 'Aktif'
    });
    setEditMode(true);
    setSelectedArea(area);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const submitData = {
        kodedivisi: formData.kodedivisi,
        kodearea: formData.kodearea,
        area: formData.namaarea,
        status: formData.status === 'Aktif'
      };
      
      if (editMode && selectedArea) {
        await areaAPI.update(selectedArea.kodedivisi, selectedArea.kodearea, submitData);
      } else {
        await areaAPI.create(submitData);
      }
      
      setOpenDialog(false);
      await loadAreas();
      
    } catch (err) {
      console.error('Error saving area:', err);
      setError(`Gagal menyimpan data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (area) => {
    setAreaToDelete(area);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!areaToDelete) return;

    try {
      setLoading(true);
      await areaAPI.delete(areaToDelete.kodedivisi, areaToDelete.kodearea);
      setDeleteConfirmOpen(false);
      setAreaToDelete(null);
      await loadAreas();
      
    } catch (err) {
      console.error('Error deleting area:', err);
      setError(`Gagal menghapus data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', px: 3, pb: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          {areas.length > 0 && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Menampilkan {filteredAreas.length} dari {areas.length} data area
            </Typography>
          )}
          
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {/* Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <TextField
              size="small"
              placeholder="Cari area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <span>
                  <IconButton onClick={loadAreas} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={loading}
              >
                Tambah Area
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.id === 'actions' ? (
                      column.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography>Memuat data...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredAreas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography>Tidak ada data area</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAreas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={`${row.kodedivisi}-${row.kodearea}` || index}>
                      <TableCell>{row.kodearea || '-'}</TableCell>
                      <TableCell>{row.namaarea || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status || 'Aktif'} 
                          color={row.status === 'Aktif' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row)}
                                disabled={loading}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(row)}
                                disabled={loading}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAreas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
          }
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Area' : 'Tambah Area'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kode Area"
                name="kodearea"
                value={formData.kodearea}
                onChange={handleInputChange}
                error={!!formErrors.kodearea}
                helperText={formErrors.kodearea}
                required
                disabled={editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nama Area"
                name="namaarea"
                value={formData.namaarea}
                onChange={handleInputChange}
                error={!!formErrors.namaarea}
                helperText={formErrors.namaarea}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Tidak Aktif">Tidak Aktif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {editMode ? 'Update' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus area "{areaToDelete?.namaarea}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterAreaOptimized;
