import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function CustomerListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        kode_customer: 'CUST001',
        nama_customer: 'PT. Maju Jaya',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        telepon: '021-12345678',
        email: 'info@majujaya.com',
        status: 'aktif'
      },
      {
        id: 2,
        kode_customer: 'CUST002',
        nama_customer: 'CV. Berkah Sejahtera',
        alamat: 'Jl. Asia Afrika No. 456, Bandung',
        telepon: '022-87654321',
        email: 'admin@berkah.com',
        status: 'aktif'
      },
      {
        id: 3,
        kode_customer: 'CUST003',
        nama_customer: 'Toko Sumber Rezeki',
        alamat: 'Jl. Pemuda No. 789, Surabaya',
        telepon: '031-11111111',
        email: 'sumberrezeki@gmail.com',
        status: 'aktif'
      },
      {
        id: 4,
        kode_customer: 'CUST004',
        nama_customer: 'UD. Mitra Usaha',
        alamat: 'Jl. Gatot Subroto No. 321, Medan',
        telepon: '061-22222222',
        email: 'mitra@usaha.co.id',
        status: 'aktif'
      },
      {
        id: 5,
        kode_customer: 'CUST005',
        nama_customer: 'PT. Global Trading',
        alamat: 'Jl. Malioboro No. 654, Yogyakarta',
        telepon: '0274-333333',
        email: 'global@trading.com',
        status: 'nonaktif'
      },
      {
        id: 6,
        kode_customer: 'CUST006',
        nama_customer: 'CV. Sentosa Makmur',
        alamat: 'Jl. Ahmad Yani No. 987, Makassar',
        telepon: '0411-555666',
        email: 'sentosa@makmur.com',
        status: 'aktif'
      }
    ];
    setData(dummyData);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.kode_customer?.toLowerCase().includes(searchLower) ||
      item.nama_customer?.toLowerCase().includes(searchLower) ||
      item.alamat?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    return status === 'aktif' 
      ? { text: 'Aktif', color: '#10b981', bg: '#f0fdf4' }
      : { text: 'Tidak Aktif', color: '#6b7280', bg: '#f9fafb' };
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh' 
    }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <Input
            type="text"
            placeholder="Cari customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/master/customer/create')}>Tambah Baru</Button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kode Customer</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Customer</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alamat</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const statusBadge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom: idx < filteredData.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: 'white', transition: 'background-color 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>{item.kode_customer}</td>
                    <td style={{ padding: '18px 20px', fontSize: '15px', color: '#334155', fontWeight: '500' }}>{item.nama_customer}</td>
                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#64748b', maxWidth: '300px' }}>{item.alamat}</td>
                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#64748b' }}>{item.email}</td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: statusBadge.color, backgroundColor: statusBadge.bg, border: `1px solid ${statusBadge.color}20` }}>{statusBadge.text}</span>
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={() => navigate(`/master/customer/edit/${item.kode_customer}`)} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '6px', transition: 'all 150ms', fontSize: '16px' }} title="Edit customer"><EditIcon /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '6px', transition: 'all 150ms', fontSize: '16px' }} title="Hapus customer"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            {search ? 'Tidak ada customer yang ditemukan' : 'Belum ada data customer'}
          </div>
        )}
        <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
          Menampilkan {filteredData.length} dari {data.length} customer
        </div>
      </div>
    </div>
  );
}

export default CustomerListPage;