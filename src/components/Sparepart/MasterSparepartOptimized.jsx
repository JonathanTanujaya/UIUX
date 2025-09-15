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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { sparepartAPI } from '../services/sparepartAPI';

const MasterSparepartOptimized = () => {
  // States
  const [spareparts, setSpareparts] = useState([]);
  const [filteredSpareparts, setFilteredSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('kodebarang');
  const [order, setOrder] = useState('asc');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSparepart, setSelectedSparepart] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sparepartToDelete, setSparepartToDelete] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    kodedivisi: '',
    kodebarang: '',
    namabarang: '',
    tglmasuk: '',
    modal: '',
    stok: '',
    satuan: '',
    keterangan: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Table columns definition
  const columns = [
    { id: 'kodedivisi', label: 'Kode Divisi', minWidth: 120 },
    { id: 'kodebarang', label: 'Kode Barang', minWidth: 120 },
    { id: 'namabarang', label: 'Nama Barang', minWidth: 200 },
    { id: 'tglmasuk', label: 'Tanggal Masuk', minWidth: 130 },
    { id: 'modal', label: 'Modal', minWidth: 100 },
    { id: 'stok', label: 'Stok', minWidth: 80 },
    { id: 'satuan', label: 'Satuan', minWidth: 100 },
    { id: 'keterangan', label: 'Keterangan', minWidth: 150 },
    { id: 'actions', label: 'Aksi', minWidth: 120, disablePadding: true }
  ];

  // Load spareparts
  const loadSpareparts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await sparepartAPI.getAll();
      console.log('Sparepart API Response:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        setSpareparts(response.data.data);
        setFilteredSpareparts(response.data.data);
      } else {
        console.warn('Unexpected sparepart data structure:', response.data);
        setSpareparts([]);
        setFilteredSpareparts([]);
      }
    } catch (err) {
      console.error('Error loading spareparts:', err);
      setError(`Gagal memuat data sparepart: ${err.response?.data?.message || err.message}`);
      setSpareparts([]);
      setFilteredSpareparts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadSpareparts();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpareparts(spareparts);
    } else {
      const filtered = spareparts.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredSpareparts(filtered);
    }
    setPage(0);
  }, [searchTerm, spareparts]);

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedData = [...filteredSpareparts].sort((a, b) => {
      const aValue = a[property] || '';
      const bValue = b[property] || '';
      
      if (aValue < bValue) return isAsc ? 1 : -1;
      if (aValue > bValue) return isAsc ? -1 : 1;
      return 0;
    });
    
    setFilteredSpareparts(sortedData);
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
    
    if (!formData.kodedivisi.trim()) errors.kodedivisi = 'Kode divisi wajib diisi';
    if (!formData.kodebarang.trim()) errors.kodebarang = 'Kode barang wajib diisi';
    if (!formData.namabarang.trim()) errors.namabarang = 'Nama barang wajib diisi';
    if (!formData.tglmasuk.trim()) errors.tglmasuk = 'Tanggal masuk wajib diisi';
    if (!formData.modal.trim()) errors.modal = 'Modal wajib diisi';
    if (!formData.stok.trim()) errors.stok = 'Stok wajib diisi';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      kodedivisi: '',
      kodebarang: '',
      namabarang: '',
      tglmasuk: '',
      modal: '',
      stok: '',
      satuan: '',
      keterangan: ''
    });
    setFormErrors({});
  };

  // CRUD operations
  const handleAdd = () => {
    resetForm();
    setEditMode(false);
    setSelectedSparepart(null);
    setOpenDialog(true);
  };

  const handleEdit = (sparepart) => {
    setFormData({
      kodedivisi: sparepart.kodedivisi || '',
      kodebarang: sparepart.kodebarang || '',
      namabarang: sparepart.namabarang || '',
      tglmasuk: sparepart.tglmasuk || '',
      modal: sparepart.modal || '',
      stok: sparepart.stok || '',
      satuan: sparepart.satuan || '',
      keterangan: sparepart.keterangan || ''
    });
    setEditMode(true);
    setSelectedSparepart(sparepart);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (editMode && selectedSparepart) {
        await sparepartAPI.update(selectedSparepart.id, formData);
      } else {
        await sparepartAPI.create(formData);
      }
      
      setOpenDialog(false);
      await loadSpareparts();
      
    } catch (err) {
      console.error('Error saving sparepart:', err);
      setError(`Gagal menyimpan data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (sparepart) => {
    setSparepartToDelete(sparepart);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sparepartToDelete) return;

    try {
      setLoading(true);
      await sparepartAPI.delete(sparepartToDelete.id);
      setDeleteConfirmOpen(false);
      setSparepartToDelete(null);
      await loadSpareparts();
      
    } catch (err) {
      console.error('Error deleting sparepart:', err);
      setError(`Gagal menghapus data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ width: '100%', px: 3, pb: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* Search and Controls */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
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
              placeholder="Cari sparepart..."
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
                <IconButton onClick={loadSpareparts} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={loading}
              >
                Tambah Sparepart
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
              ) : filteredSpareparts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography>Tidak ada data sparepart</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSpareparts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={row.id || index}>
                      <TableCell>{row.kodedivisi || '-'}</TableCell>
                      <TableCell>{row.kodebarang || '-'}</TableCell>
                      <TableCell>{row.namabarang || '-'}</TableCell>
                      <TableCell>{formatDate(row.tglmasuk)}</TableCell>
                      <TableCell>{formatCurrency(row.modal)}</TableCell>
                      <TableCell>{row.stok || 0}</TableCell>
                      <TableCell>{row.satuan || '-'}</TableCell>
                      <TableCell>{row.keterangan || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              disabled={loading}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(row)}
                              disabled={loading}
                            >
                              <DeleteIcon />
                            </IconButton>
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
          count={filteredSpareparts.length}
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
          {editMode ? 'Edit Sparepart' : 'Tambah Sparepart'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kode Divisi"
                name="kodedivisi"
                value={formData.kodedivisi}
                onChange={handleInputChange}
                error={!!formErrors.kodedivisi}
                helperText={formErrors.kodedivisi}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kode Barang"
                name="kodebarang"
                value={formData.kodebarang}
                onChange={handleInputChange}
                error={!!formErrors.kodebarang}
                helperText={formErrors.kodebarang}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Barang"
                name="namabarang"
                value={formData.namabarang}
                onChange={handleInputChange}
                error={!!formErrors.namabarang}
                helperText={formErrors.namabarang}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tanggal Masuk"
                name="tglmasuk"
                type="date"
                value={formData.tglmasuk}
                onChange={handleInputChange}
                error={!!formErrors.tglmasuk}
                helperText={formErrors.tglmasuk}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Modal"
                name="modal"
                type="number"
                value={formData.modal}
                onChange={handleInputChange}
                error={!!formErrors.modal}
                helperText={formErrors.modal}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stok"
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleInputChange}
                error={!!formErrors.stok}
                helperText={formErrors.stok}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Satuan"
                name="satuan"
                value={formData.satuan}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keterangan"
                name="keterangan"
                multiline
                rows={3}
                value={formData.keterangan}
                onChange={handleInputChange}
              />
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
            Apakah Anda yakin ingin menghapus sparepart "{sparepartToDelete?.namabarang}"?
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

export default MasterSparepartOptimized;
