import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function MTTList({ onEdit, onRefresh }) {
  const [mtts, setMtts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchMtts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/tts`); // Changed from /mtt to /tts
      let mttsData = [];
      if (response.data && Array.isArray(response.data.data)) {
        mttsData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        mttsData = response.data;
      }
      setMtts(mttsData); // Ensure it's always an array
      toast.success('Data MTT berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching MTTs:', error);
      toast.error('Gagal memuat data MTT.');
      setMtts([]); // Ensure mtts is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchMtts();
  }, [onRefresh]);

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus MTT ini?')) {
      try {
        await axios.delete(`${API_URL}/tts/${id}`); // Changed from /mtt to /tts
        fetchMtts();
        toast.success('MTT berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting MTT:', error);
        toast.error('Gagal menghapus MTT.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data MTT...</div>; // Display loading message
  }

  // Ensure mtts is an array before mapping
  if (!Array.isArray(mtts)) {
    console.error('MTTs state is not an array:', mtts);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar MTT</h2>
      <table>
        <thead>
          <tr>
            <th>No TT</th>
            <th>Tanggal</th>
            <th>Kode Customer</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mtts.map(mtt => (
            <tr key={mtt.id}>
              <td>{mtt.NoTT}</td>
              <td>{mtt.Tanggal}</td>
              <td>{mtt.KodeCust}</td>
              <td>{mtt.Keterangan}</td>
              <td>
                <button onClick={() => onEdit(mtt)}>Edit</button>
                <button onClick={() => handleDelete(mtt.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MTTList;
