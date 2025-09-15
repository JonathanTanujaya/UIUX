import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mcoaService } from '../config/apiService.js';

function MCOAList({ onEdit, onRefresh }) {
  const [coas, setCoas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoas = async () => {
    setLoading(true);
    try {
      const result = await mcoaService.getAll();
      if (result.success) {
        setCoas(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Error fetching COAs:', result.error);
        toast.error(result.message || 'Gagal memuat data COA.');
        setCoas([]);
      }
    } catch (error) {
      console.error('Error fetching COAs:', error);
      toast.error('Gagal memuat data COA.');
      setCoas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoas();
  }, [onRefresh]);

  const handleDelete = async kodeCOA => {
    if (window.confirm('Apakah Anda yakin ingin menghapus COA ini?')) {
      try {
        const result = await mcoaService.delete(kodeCOA);
        if (result.success) {
          fetchCoas();
          toast.success(result.message || 'COA berhasil dihapus!');
        } else {
          toast.error(result.message || 'Gagal menghapus COA.');
        }
      } catch (error) {
        console.error('Error deleting COA:', error);
        toast.error('Gagal menghapus COA.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data COA...</div>; // Display loading message
  }

  // Ensure coas is an array before mapping
  if (!Array.isArray(coas)) {
    console.error('COAs state is not an array:', coas);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar COA</h2>
      <table>
        <thead>
          <tr>
            <th>Kode COA</th>
            <th>Nama COA</th>
            <th>Saldo Normal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {coas.map(coa => (
            <tr key={coa.KodeCOA}>
              <td>{coa.KodeCOA}</td>
              <td>{coa.NamaCOA}</td>
              <td>{coa.SaldoNormal}</td>
              <td>
                <button onClick={() => onEdit(coa)}>Edit</button>
                <button onClick={() => handleDelete(coa.KodeCOA)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MCOAList;
