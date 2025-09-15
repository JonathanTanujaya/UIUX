import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const StokMinimumForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    stok_minimum: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nama_barang: itemToEdit.nama_barang || '',
        stok_minimum: itemToEdit.stok_minimum || '',
      });
    } else {
      setFormData({
        nama_barang: '',
        stok_minimum: '',
      });
    }
  }, [itemToEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = itemToEdit ? 'PUT' : 'POST';
      const url = itemToEdit ? `/api/stok-minimum/${itemToEdit.id}` : '/api/stok-minimum';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(`Data berhasil ${itemToEdit ? 'diperbarui' : 'ditambahkan'}!`);
      onFormSuccess();
    } catch (error) {
      toast.error('Gagal menyimpan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {itemToEdit ? 'Edit' : 'Tambah'} Stok Minimum
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Barang"
          name="nama_barang"
          value={formData.nama_barang}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Stok Minimum"
          name="stok_minimum"
          value={formData.stok_minimum}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : itemToEdit ? 'Update' : 'Simpan'}
        </Button>
      </form>
    </Paper>
  );
};

export default StokMinimumForm;
