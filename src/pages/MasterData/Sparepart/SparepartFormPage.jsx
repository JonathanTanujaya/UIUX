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
    kode_barang: '',
    nama_barang: '',
    kode_kategori: '',
    satuan: 'pcs',
    stok: '',
    min_stok: '',
    harga_beli: '',
    harga_jual: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/kategori').then(res => setCategories(res.data || []));
    if (isEdit) {
      api.get(`/spareparts/${id}`).then(res => {
        setFormData(res.data || {});
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/spareparts/${id}`, formData);
        toast.success('Sparepart berhasil diupdate!');
      } else {
        await api.post('/spareparts', formData);
        toast.success('Sparepart berhasil ditambahkan!');
      }
      navigate('/master/sparepart');
    } catch (err) {
      toast.error('Gagal menyimpan data!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Row 1: Kode & Nama */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <Input 
                  label="Kode Barang *" 
                  name="kode_barang" 
                  value={formData.kode_barang} 
                  onChange={handleChange} 
                  required 
                  disabled={isEdit}
                  placeholder="BRG001"
                />
                <Input 
                  label="Nama Sparepart *" 
                  name="nama_barang" 
                  value={formData.nama_barang} 
                  onChange={handleChange} 
                  required
                  placeholder="Masukkan nama sparepart..."
                />
              </div>

              {/* Row 2: Kategori & Satuan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Select label="Kategori *" name="kode_kategori" value={formData.kode_kategori} onChange={handleChange} required>
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.kode_kategori} value={cat.kode_kategori}>{cat.nama_kategori}</option>
                  ))}
                </Select>
                <Select label="Satuan *" name="satuan" value={formData.satuan} onChange={handleChange} required>
                  <option value="pcs">Pcs</option>
                  <option value="box">Box</option>
                  <option value="set">Set</option>
                  <option value="unit">Unit</option>
                  <option value="pack">Pack</option>
                </Select>
              </div>

              {/* Row 3: Stok & Harga Beli */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input 
                  label="Stok Saat Ini *" 
                  type="number" 
                  name="stok" 
                  value={formData.stok} 
                  onChange={handleChange} 
                  required
                  placeholder="0"
                />
                <Input 
                  label="Harga Beli *" 
                  type="number" 
                  name="harga_beli" 
                  value={formData.harga_beli} 
                  onChange={handleChange} 
                  required
                  placeholder="Rp 0"
                />
              </div>

              {/* Row 4: Harga Jual & Min Stok */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input 
                  label="Harga Jual *" 
                  type="number" 
                  name="harga_jual" 
                  value={formData.harga_jual} 
                  onChange={handleChange} 
                  required
                  placeholder="Rp 0"
                />
                <Input 
                  label="Minimum Stok *" 
                  type="number" 
                  name="min_stok" 
                  value={formData.min_stok} 
                  onChange={handleChange} 
                  required
                  placeholder="0"
                />
              </div>

              {/* Row 5: Supplier & Lokasi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '6px' 
                  }}>
                    Supplier
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}>
                    <option value="">Pilih Supplier</option>
                  </select>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '6px' 
                  }}>
                    Lokasi Penyimpanan
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}>
                    <option value="">Pilih Lokasi</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '12px',
                borderTop: '1px solid #f3f4f6',
                marginTop: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => navigate('/master/sparepart')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#dc2626',
                    backgroundColor: 'white',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: loading ? '#9ca3af' : '#22c55e',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SparepartFormPage;
