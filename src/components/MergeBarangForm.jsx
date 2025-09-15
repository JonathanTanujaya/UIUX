import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MergeBarangForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    barang_asal: '',
    barang_tujuan: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        barang_asal: itemToEdit.barang_asal || '',
        barang_tujuan: itemToEdit.barang_tujuan || '',
      });
    } else {
      setFormData({
        barang_asal: '',
        barang_tujuan: '',
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
      const url = itemToEdit ? `/api/merge-barang/${itemToEdit.id}` : '/api/merge-barang';

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
        {itemToEdit ? 'Edit' : 'Tambah'} Merge Barang
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Barang Asal"
          name="barang_asal"
          value={formData.barang_asal}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Barang Tujuan"
          name="barang_tujuan"
          value={formData.barang_tujuan}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : itemToEdit ? 'Update' : 'Simpan'}
        </Button>
      </form>
    </Paper>
  );
};

export default MergeBarangForm;
