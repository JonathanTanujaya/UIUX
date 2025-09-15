import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { masterUserService } from '../config/apiService.js';

function MasterUserList({ onEdit, onRefresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await masterUserService.getAll();
      if (result.success) {
        setUsers(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Error fetching users:', result.error);
        toast.error(result.message || 'Gagal memuat data pengguna.');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data pengguna.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [onRefresh]);

  const handleDelete = async (kodeDivisi, username) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        const result = await masterUserService.delete(kodeDivisi, username);
        if (result.success) {
          fetchUsers();
          toast.success(result.message || 'Pengguna berhasil dihapus!');
        } else {
          toast.error(result.message || 'Gagal menghapus pengguna.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Gagal menghapus pengguna.');
      }
    }
  };

  if (loading) {
    return <div>Memuat data pengguna...</div>; // Display loading message
  }

  // Ensure users is an array before mapping
  if (!Array.isArray(users)) {
    console.error('Users state is not an array:', users);
    return <div>Terjadi kesalahan dalam memuat data.</div>; // Or handle gracefully
  }

  return (
    <div>
      <h2>Daftar Pengguna</h2>
      <table>
        <thead>
          <tr>
            <th>Kode Divisi</th>
            <th>Username</th>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={`${user.KodeDivisi}-${user.Username}`}>
              <td>{user.KodeDivisi}</td>
              <td>{user.Username}</td>
              <td>{user.Nama}</td>
              <td>
                <button onClick={() => onEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.KodeDivisi, user.Username)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MasterUserList;
