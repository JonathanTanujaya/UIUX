import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MVoucherForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    kode_voucher: '',
    nilai: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        kode_voucher: itemToEdit.kode_voucher || '',
        nilai: itemToEdit.nilai || '',
      });
    } else {
      setFormData({
        kode_voucher: '',
        nilai: '',
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
      const url = itemToEdit ? `/api/m-voucher/${itemToEdit.id}` : '/api/m-voucher';

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
        {itemToEdit ? 'Edit' : 'Tambah'} M Voucher
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Kode Voucher"
          name="kode_voucher"
          value={formData.kode_voucher}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Nilai"
          name="nilai"
          value={formData.nilai}
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

export default MVoucherForm;
