import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const PartPenerimaanBonusForm = ({ itemToEdit, onFormSuccess }) => {
  const [formData, setFormData] = useState({
    nama_part: '',
    jumlah_bonus: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nama_part: itemToEdit.nama_part || '',
        jumlah_bonus: itemToEdit.jumlah_bonus || '',
      });
    } else {
      setFormData({
        nama_part: '',
        jumlah_bonus: '',
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
      const url = itemToEdit
        ? `/api/part-penerimaan-bonus/${itemToEdit.id}`
        : '/api/part-penerimaan-bonus';

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
        {itemToEdit ? 'Edit' : 'Tambah'} Part Penerimaan Bonus
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Part"
          name="nama_part"
          value={formData.nama_part}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Jumlah Bonus"
          name="jumlah_bonus"
          value={formData.jumlah_bonus}
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

export default PartPenerimaanBonusForm;
