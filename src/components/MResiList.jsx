import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function MResiList({ onEdit, onRefresh }) {
  const [resis, setResis] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchResis = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/resis`); // Changed from /mresi to /resis
      let resisData = [];
      if (response.data && Array.isArray(response.data.data)) {
        resisData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        resisData = response.data;
      }
      setResis(resisData); // Ensure it's always an array
      toast.success('Data resi berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching resis:', error);
      toast.error('Gagal memuat data resi.');
      setResis([]); // Ensure resis is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchResis();
  }, [onRefresh]);

  const handleDelete = async (kodeDivisi, noResi) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus resi ini?')) {
      try {
        await axios.delete(`${API_URL}/resis/${kodeDivisi}/${noResi}`); // Changed from /mresi to /resis
        fetchResis();
        toast.success('Resi berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting resi:', error);
        toast.error('Gagal menghapus resi.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data resi...</div>; // Display loading message
  }

  // Ensure resis is an array before mapping
  if (!Array.isArray(resis)) {
    console.error('Resis state is not an array:', resis);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Resi</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Divisi</th>
            <th>No Resi</th>
            <th>No Rekening Tujuan</th>
            <th>Tgl Pembayaran</th>
            <th>Kode Customer</th>
            <th>Jumlah</th>
            <th>Sisa Resi</th>
            <th>Keterangan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {resis.map(resi => (
            <tr key={`${resi.KodeDivisi}-${resi.NoResi}`}>
              <td>{resi.KodeDivisi}</td>
              <td>{resi.NoResi}</td>
              <td>{resi.NoRekeningTujuan}</td>
              <td>{resi.TglPembayaran}</td>
              <td>{resi.KodeCust}</td>
              <td>{resi.Jumlah}</td>
              <td>{resi.SisaResi}</td>
              <td>{resi.Keterangan}</td>
              <td>{resi.Status}</td>
              <td>
                <button onClick={() => onEdit(resi)}>Edit</button>
                <button onClick={() => handleDelete(resi.KodeDivisi, resi.NoResi)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MResiList;
