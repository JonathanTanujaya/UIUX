import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mdokumenService } from '../config/apiService.js';

function MDokumenList({ onEdit, onRefresh }) {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const result = await mdokumenService.getAll();
      if (result.success) {
        setDokumen(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Error fetching dokumen:', result.error);
        toast.error(result.message || 'Gagal memuat data dokumen.');
        setDokumen([]);
      }
    } catch (error) {
      console.error('Error fetching dokumen:', error);
      toast.error('Gagal memuat data dokumen.');
      setDokumen([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, [onRefresh]);

  const handleDelete = async (kodeDivisi, kodeDok) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      try {
        const result = await mdokumenService.delete(kodeDivisi, kodeDok);
        if (result.success) {
          fetchDokumen();
          toast.success(result.message || 'Dokumen berhasil dihapus!');
        } else {
          toast.error(result.message || 'Gagal menghapus dokumen.');
        }
      } catch (error) {
        console.error('Error deleting dokumen:', error);
        toast.error('Gagal menghapus dokumen.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data dokumen...</div>; // Display loading message
  }

  // Ensure dokumen is an array before mapping
  if (!Array.isArray(dokumen)) {
    console.error('Dokumen state is not an array:', dokumen);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Dokumen</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Divisi</th>
            <th>Kode Dokumen</th>
            <th>Nomor</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dokumen.map(doc => (
            <tr key={`${doc.KodeDivisi}-${doc.KodeDok}`}>
              <td>{doc.KodeDivisi}</td>
              <td>{doc.KodeDok}</td>
              <td>{doc.Nomor}</td>
              <td>
                <button onClick={() => onEdit(doc)}>Edit</button>
                <button onClick={() => handleDelete(doc.KodeDivisi, doc.KodeDok)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MDokumenList;
