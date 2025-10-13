import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { banksAPI } from '../../../services/api';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MasterBank = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    no_rekening: '',
    kode_bank: '',
    nama_bank: '',
    atas_nama: '',
    status_rekening: true,
    saldo: '0',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await banksAPI.getAll();
      
      const bankData = response.data || [];
      setData(bankData);
    } catch (error) {
      console.error('Error fetching bank data:', error);
      // Fallback to sample data if API fails
      const sampleData = [
        {
          no_rekening: '1234567890',
          kode_bank: 'BCA',
          nama_bank: 'Bank Central Asia',
          atas_nama: 'PT. Contoh Perusahaan',
          status_rekening: true,
          saldo: 1000000.00,
        },
        {
          no_rekening: '0987654321',
          kode_bank: 'BNI',
          nama_bank: 'Bank Negara Indonesia',
          atas_nama: 'PT. Contoh Perusahaan',
          status_rekening: true,
          saldo: 500000.00,
        },
      ];
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        await banksAPI.update(editingItem.no_rekening, formData);
        setData(prev =>
          prev.map(item =>
            item.no_rekening === editingItem.no_rekening ? { ...formData } : item
          )
        );
        alert('Data rekening bank berhasil diupdate!');
      } else {
        const response = await banksAPI.create(formData);
        const newItem = response.data || formData;
        setData(prev => [...prev, newItem]);
        alert('Data rekening bank berhasil ditambahkan!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving bank account:', error);
      alert('Error saving bank account');
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData({
      no_rekening: item.no_rekening,
      kode_bank: item.kode_bank,
      nama_bank: item.nama_bank,
      atas_nama: item.atas_nama,
      status_rekening: item.status_rekening,
      saldo: item.saldo || '0',
    });
    setShowForm(true);
  };

  const handleDelete = async (no_rekening) => {
    if (confirm('Yakin ingin menghapus data rekening ini?')) {
      try {
        await banksAPI.delete(no_rekening);
        setData(prev => prev.filter(item => item.no_rekening !== no_rekening));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting bank account:', error);
        alert('Error deleting bank account');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      no_rekening: '',
      kode_bank: '',
      nama_bank: '',
      atas_nama: '',
      status_rekening: true,
      saldo: '0',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: status ? '#dcfce7' : '#fee2e2',
        color: status ? '#166534' : '#991b1b',
      }}>
        {status ? 'Aktif' : 'Non-Aktif'}
      </span>
    );
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.no_rekening?.toLowerCase().includes(search) ||
      item.kode_bank?.toLowerCase().includes(search) ||
      item.nama_bank?.toLowerCase().includes(search) ||
      item.atas_nama?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f9fafb',
        minHeight: '100%'
      }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f8fafc',
        minHeight: '100%'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <Button
            onClick={resetForm}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#6b7280',
              border: '1px solid #d1d5db',
            }}
          >
            ← Kembali
          </Button>
        </div>

        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
          }}>
            {editingItem ? 'Edit Bank' : 'Tambah Bank'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                No. Rekening
              </label>
              <Input
                name="no_rekening"
                value={formData.no_rekening}
                onChange={handleInputChange}
                placeholder="Masukkan nomor rekening"
                required
                disabled={editingItem}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Kode Bank
              </label>
              <Input
                name="kode_bank"
                value={formData.kode_bank}
                onChange={handleInputChange}
                placeholder="Contoh: BCA, BNI, BRI"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Nama Bank
              </label>
              <Input
                name="nama_bank"
                value={formData.nama_bank}
                onChange={handleInputChange}
                placeholder="Contoh: Bank Central Asia"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Atas Nama
              </label>
              <Input
                name="atas_nama"
                value={formData.atas_nama}
                onChange={handleInputChange}
                placeholder="Nama pemegang rekening"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Saldo Awal
              </label>
              <Input
                type="number"
                name="saldo"
                value={formData.saldo}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="status_rekening"
                  checked={formData.status_rekening}
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Rekening Aktif</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {editingItem ? 'Update' : 'Simpan'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'white',
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f9fafb',
      minHeight: '100%'
    }}>
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            Rekening Bank
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Kelola rekening bank perusahaan
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          + Tambah Bank
        </Button>
      </div>

      {/* Bank Cards Grid - segmented and comfortable for small lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {data.map((item) => (
          <div
            key={item.no_rekening}
            onClick={() => {
              // TODO: Navigate ke laporan arus kas untuk bank ini
              // navigate(`/reports/cash-flow/${item.no_rekening}`);
              console.log('Navigate to cash flow report for:', item.nama_bank);
            }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 6px -1px rgba(0, 0, 0, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header segment */}
            <div style={{
              background: '#f5f7ff',
              borderBottom: '1px solid #e5e7eb',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px #e5e7eb'
                }}>
                  <span style={{ fontSize: '20px' }}>🏦</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }} title={item.nama_bank}>
                      {item.nama_bank}
                    </div>
                    <span title={item.status_rekening ? 'Aktif' : 'Non-Aktif'} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 9999, backgroundColor: item.status_rekening ? '#10b981' : '#ef4444' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{item.kode_bank}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                  style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#3b82f6', background: 'white', border: '1px solid #dbeafe', borderRadius: 8, cursor: 'pointer' }}
                  title="Edit"
                >✏️</button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.no_rekening); }}
                  style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#dc2626', background: 'white', border: '1px solid #fee2e2', borderRadius: 8, cursor: 'pointer' }}
                  title="Hapus"
                >🗑️</button>
              </div>
            </div>

            {/* Body segment */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '12px 14px' }}>
              <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px', flex: 1, border: '1px solid #eef2f7' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  rowGap: '6px',
                  columnGap: '10px',
                  alignItems: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>No. Rek</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', fontFamily: 'monospace' }}>
                    {item.no_rekening}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Atas Nama</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.atas_nama}
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: '4px', textAlign: 'right', minWidth: '160px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Saldo</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>
                  {formatCurrency(item.saldo)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {data.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '60px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
            }}>
              Belum ada rekening bank
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '20px',
            }}>
              Tambahkan rekening bank untuk mulai mengelola keuangan
            </p>
            <Button
              onClick={() => setShowForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Tambah Bank Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterBank;
