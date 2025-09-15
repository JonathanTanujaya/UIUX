import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function PenerimaanFinanceList({ onEdit, onRefresh }) {
  const [penerimaan, setPenerimaan] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchPenerimaan = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/penerimaan-finance`);
      let penerimaanData = [];
      if (response.data && Array.isArray(response.data.data)) {
        penerimaanData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        penerimaanData = response.data;
      }
      setPenerimaan(penerimaanData); // Ensure it's always an array
      toast.success('Data penerimaan finance berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching penerimaan finance:', error);
      toast.error('Gagal memuat data penerimaan finance.');
      setPenerimaan([]); // Ensure penerimaan is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchPenerimaan();
  }, [onRefresh]);

  const handleDelete = async (kodeDivisi, noPenerimaan) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus penerimaan finance ini?')) {
      try {
        await axios.delete(`${API_URL}/penerimaan-finance/${kodeDivisi}/${noPenerimaan}`);
        fetchPenerimaan();
        toast.success('Penerimaan finance berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting penerimaan finance:', error);
        toast.error('Gagal menghapus penerimaan finance.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data penerimaan finance...</div>; // Display loading message
  }

  // Ensure penerimaan is an array before mapping
  if (!Array.isArray(penerimaan)) {
    console.error('Penerimaan state is not an array:', penerimaan);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Penerimaan Finance</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Divisi</th>
            <th>No Penerimaan</th>
            <th>Tgl Penerimaan</th>
            <th>Tipe</th>
            <th>No Ref</th>
            <th>Kode Customer</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {penerimaan.map(item => (
            <tr key={`${item.KodeDivisi}-${item.NoPenerimaan}`}>
              <td>{item.KodeDivisi}</td>
              <td>{item.NoPenerimaan}</td>
              <td>{item.TglPenerimaan}</td>
              <td>{item.Tipe}</td>
              <td>{item.NoRef}</td>
              <td>{item.KodeCust}</td>
              <td>{item.Jumlah}</td>
              <td>{item.Status}</td>
              <td>
                <button onClick={() => onEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.KodeDivisi, item.NoPenerimaan)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PenerimaanFinanceList;
