import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

const PartPenerimaanBonusList = ({ onEdit, onRefresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [onRefresh]); // Refresh data ketika onRefresh berubah

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ganti dengan endpoint API yang sesuai
      const response = await fetch('/api/part-penerimaan-bonus');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      toast.error('Gagal memuat data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        // Ganti dengan endpoint API yang sesuai
        const response = await fetch(`/api/part-penerimaan-bonus/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success('Data berhasil dihapus!');
        fetchData(); // Refresh list setelah penghapusan
      } catch (err) {
        toast.error('Gagal menghapus data: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nama Part</TableCell>
            <TableCell>Jumlah Bonus</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.nama_part}</TableCell>
              <TableCell>{row.jumlah_bonus}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onEdit(row)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(row.id)}>
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PartPenerimaanBonusList;
