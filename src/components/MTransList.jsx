import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function MTransList({ onEdit, onRefresh }) {
  const [mtrans, setMtrans] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchMtrans = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/trans`); // Changed from /mtrans to /trans
      let mtransData = [];
      if (response.data && Array.isArray(response.data.data)) {
        mtransData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        mtransData = response.data;
      }
      setMtrans(mtransData); // Ensure it's always an array
      toast.success('Data transaksi berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching MTrans:', error);
      toast.error('Gagal memuat data transaksi.');
      setMtrans([]); // Ensure mtrans is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchMtrans();
  }, [onRefresh]);

  const handleDelete = async kodeTrans => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await axios.delete(`${API_URL}/trans/${kodeTrans}`); // Changed from /mtrans to /trans
        fetchMtrans();
        toast.success('Transaksi berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting MTrans:', error);
        toast.error('Gagal menghapus transaksi.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data transaksi...</div>; // Display loading message
  }

  // Ensure mtrans is an array before mapping
  if (!Array.isArray(mtrans)) {
    console.error('MTrans state is not an array:', mtrans);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Transaksi</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Transaksi</th>
            <th>Transaksi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mtrans.map(trans => (
            <tr key={trans.KodeTrans}>
              <td>{trans.KodeTrans}</td>
              <td>{trans.Transaksi}</td>
              <td>
                <button onClick={() => onEdit(trans)}>Edit</button>
                <button onClick={() => handleDelete(trans.KodeTrans)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MTransList;
