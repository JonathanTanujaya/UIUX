import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { toast } from 'react-toastify';
import api from '../../../services/api';

function SparepartFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    nama_barang: '',
    kode_kategori: '',
    harga_list: '',
    harga_jual: '',
    satuan: '',
    merk: '',
    lokasi: ''
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  // Available satuan options
  const satuanOptions = ['Pcs', 'Set', 'Box', 'Unit', 'Pack', 'Lusin', 'Karton'];

  useEffect(() => {
    // Fetch categories
    api.get('/kategori').then(res => setCategories(res.data || [])).catch(() => {});
    
    // Fetch locations - in real app, this would be from API
    setLocations(['Gudang A', 'Gudang B', 'Gudang C', 'Rak 1', 'Rak 2', 'Showroom']);
    
    if (isEdit) {
      api.get(`/spareparts/${id}`).then(res => {
        setFormData(res.data || {});
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations(prev => [...prev, newLocation.trim()]);
      setFormData(prev => ({ ...prev, lokasi: newLocation.trim() }));
      setNewLocation('');
      setShowLocationModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama barang wajib diisi';
    }
    
    if (!formData.kode_kategori) {
      newErrors.kode_kategori = 'Kategori wajib dipilih';
    }
    
    if (!formData.harga_list) {
      newErrors.harga_list = 'Harga list wajib diisi';
    }
    
    if (!formData.harga_jual) {
      newErrors.harga_jual = 'Harga jual wajib diisi';
    }
    
    if (!formData.satuan) {
      newErrors.satuan = 'Satuan wajib dipilih';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      
      if (isEdit) {
        await api.put(`/spareparts/${id}`, dataToSubmit);
        toast.success('Sparepart berhasil diupdate');
      } else {
        await api.post('/spareparts', dataToSubmit);
        toast.success('Sparepart berhasil ditambahkan');
      }
      navigate('/master/sparepart');
    } catch (err) {
      toast.error('Gagal menyimpan sparepart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      overflow: 'auto', 
      padding: '0', 
      backgroundColor: '#f9fafb'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '24px',
          minHeight: '100%'
        }}>
          {/* Two Column Layout */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Left Column - Informasi Barang */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                marginBottom: '2px', 
                paddingBottom: '2px', 
                borderBottom: '2px solid #e5e7eb' 
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0 
                }}>
                  Informasi Barang
                </h3>
              </div>

              {/* Nama Barang */}
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Nama Barang <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleChange}
                  placeholder="Masukkan nama barang"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.nama_barang ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = errors.nama_barang ? '#ef4444' : '#d1d5db'}
                />
                {errors.nama_barang && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.nama_barang}
                  </span>
                )}
              </div>

              {/* Kategori */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Kategori <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="kode_kategori"
                  value={formData.kode_kategori}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.kode_kategori ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = errors.kode_kategori ? '#ef4444' : '#d1d5db'}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(cat => (
                    <option key={cat.kode_kategori} value={cat.kode_kategori}>
                      {cat.nama_kategori}
                    </option>
                  ))}
                </select>
                {errors.kode_kategori && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.kode_kategori}
                  </span>
                )}
              </div>

              {/* Satuan - Dropdown */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Satuan <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="satuan"
                  value={formData.satuan}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.satuan ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = errors.satuan ? '#ef4444' : '#d1d5db'}
                >
                  <option value="">Pilih satuan</option>
                  {satuanOptions.map(satuan => (
                    <option key={satuan} value={satuan}>
                      {satuan}
                    </option>
                  ))}
                </select>
                {errors.satuan && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.satuan}
                  </span>
                )}
              </div>

              {/* Merk */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Merk
                </label>
                <input
                  type="text"
                  name="merk"
                  value={formData.merk}
                  onChange={handleChange}
                  placeholder="Masukkan merk"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Lokasi with Add Button */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Lokasi
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">Pilih lokasi</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(true)}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    title="Tambah lokasi baru"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Informasi Harga */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                marginBottom: '2px', 
                paddingBottom: '2px', 
                borderBottom: '2px solid #e5e7eb' 
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0 
                }}>
                  Informasi Harga
                </h3>
              </div>

              {/* Harga List */}
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Harga List <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="harga_list"
                  value={formData.harga_list}
                  onChange={handleChange}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.harga_list ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = errors.harga_list ? '#ef4444' : '#d1d5db'}
                />
                {errors.harga_list && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.harga_list}
                  </span>
                )}
              </div>

              {/* Harga Jual */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1e293b' 
                }}>
                  Harga Jual <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="harga_jual"
                  value={formData.harga_jual}
                  onChange={handleChange}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.harga_jual ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = errors.harga_jual ? '#ef4444' : '#d1d5db'}
                />
                {errors.harga_jual && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.harga_jual}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                marginTop: '32px'
              }}>
                <button
                  type="button"
                  onClick={() => navigate('/master/sparepart')}
                  style={{
                    height: '44px',
                    padding: '0 28px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    height: '44px',
                    padding: '0 32px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={e => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal Add Location */}
      {showLocationModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#1e293b' 
            }}>
              Tambah Lokasi Baru
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 500, 
                color: '#475569' 
              }}>
                Nama Lokasi
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="Contoh: Gudang D"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleAddLocation();
                  }
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowLocationModal(false);
                  setNewLocation('');
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddLocation}
                disabled={!newLocation.trim()}
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'white',
                  backgroundColor: newLocation.trim() ? '#3b82f6' : '#94a3b8',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: newLocation.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={e => {
                  if (newLocation.trim()) e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={e => {
                  if (newLocation.trim()) e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SparepartFormPage;
