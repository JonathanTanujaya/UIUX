import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function ReturnSalesList({ onEdit, onRefresh }) {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchReturns = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/return-sales`);
      let returnsData = [];
      if (response.data && Array.isArray(response.data.data)) {
        returnsData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        returnsData = response.data;
      }
      setReturns(returnsData); // Ensure it's always an array
      toast.success('Data retur penjualan berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching return sales:', error);
      toast.error('Gagal memuat data retur penjualan.');
      setReturns([]); // Ensure returns is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [onRefresh]);

  const handleDelete = async (kodeDivisi, noRetur) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus retur penjualan ini?')) {
      try {
        await axios.delete(`${API_URL}/return-sales/${kodeDivisi}/${noRetur}`);
        fetchReturns();
        toast.success('Retur penjualan berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting return sales:', error);
        toast.error('Gagal menghapus retur penjualan.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data retur penjualan...</div>; // Display loading message
  }

  // Ensure returns is an array before mapping
  if (!Array.isArray(returns)) {
    console.error('Returns state is not an array:', returns);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Retur Penjualan</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Divisi</th>
            <th>No Retur</th>
            <th>Tgl Retur</th>
            <th>Kode Customer</th>
            <th>Total</th>
            <th>Sisa Retur</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(item => (
            <tr key={`${item.KodeDivisi}-${item.NoRetur}`}>
              <td>{item.KodeDivisi}</td>
              <td>{item.NoRetur}</td>
              <td>{item.TglRetur}</td>
              <td>{item.KodeCust}</td>
              <td>{item.Total}</td>
              <td>{item.SisaRetur}</td>
              <td>{item.Status}</td>
              <td>
                <button onClick={() => onEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.KodeDivisi, item.NoRetur)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReturnSalesList;
