import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const SaldoBankForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    nama_bank: '',
    saldo: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nama_bank: itemToEdit.nama_bank || '',
        saldo: itemToEdit.saldo || '',
      });
    } else {
      setFormData({
        nama_bank: '',
        saldo: '',
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
      const url = itemToEdit ? `/api/saldo-bank/${itemToEdit.id}` : '/api/saldo-bank';

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
        {itemToEdit ? 'Edit' : 'Tambah'} Saldo Bank
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Bank"
          name="nama_bank"
          value={formData.nama_bank}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Saldo"
          name="saldo"
          value={formData.saldo}
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

export default SaldoBankForm;
