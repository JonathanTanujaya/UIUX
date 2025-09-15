import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const SPVForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    nomor_spv: '',
    tanggal: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nomor_spv: itemToEdit.nomor_spv || '',
        tanggal: itemToEdit.tanggal || '',
      });
    } else {
      setFormData({
        nomor_spv: '',
        tanggal: '',
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
      const url = itemToEdit ? `/api/spv/${itemToEdit.id}` : '/api/spv';

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
        {itemToEdit ? 'Edit' : 'Tambah'} SPV
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nomor SPV"
          name="nomor_spv"
          value={formData.nomor_spv}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Tanggal"
          name="tanggal"
          value={formData.tanggal}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : itemToEdit ? 'Update' : 'Simpan'}
        </Button>
      </form>
    </Paper>
  );
};

export default SPVForm;
