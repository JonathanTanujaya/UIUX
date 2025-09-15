import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const DPaketForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    nama_paket: '',
    deskripsi: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nama_paket: itemToEdit.nama_paket || '',
        deskripsi: itemToEdit.deskripsi || '',
      });
    } else {
      setFormData({
        nama_paket: '',
        deskripsi: '',
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
      const url = itemToEdit ? `/api/d-paket/${itemToEdit.id}` : '/api/d-paket';

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
        {itemToEdit ? 'Edit' : 'Tambah'} D Paket
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Paket"
          name="nama_paket"
          value={formData.nama_paket}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Deskripsi"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : itemToEdit ? 'Update' : 'Simpan'}
        </Button>
      </form>
    </Paper>
  );
};

export default DPaketForm;
