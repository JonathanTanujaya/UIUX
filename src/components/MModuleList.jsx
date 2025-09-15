import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

function MModuleList({ onEdit, onRefresh }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchModules = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${API_URL}/mmodule`);
      let modulesData = [];
      if (response.data && Array.isArray(response.data.data)) {
        modulesData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        modulesData = response.data;
      }
      setModules(modulesData); // Ensure it's always an array
      toast.success('Data modul berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Gagal memuat data modul.');
      setModules([]); // Ensure modules is an empty array on error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchModules();
  }, [onRefresh]);

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus modul ini?')) {
      try {
        await axios.delete(`${API_URL}/mmodule/${id}`);
        fetchModules();
        toast.success('Modul berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting module:', error);
        toast.error('Gagal menghapus modul.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data modul...</div>; // Display loading message
  }

  // Ensure modules is an array before mapping
  if (!Array.isArray(modules)) {
    console.error('Modules state is not an array:', modules);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Modul</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Modul</th>
            <th>BT ID</th>
            <th>Modal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(mod => (
            <tr key={mod.id}>
              <td>{mod.id}</td>
              <td>{mod.NamaModule}</td>
              <td>{mod.btID}</td>
              <td>{mod.Modal ? 'Ya' : 'Tidak'}</td>
              <td>
                <button onClick={() => onEdit(mod)}>Edit</button>
                <button onClick={() => handleDelete(mod.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MModuleList;
