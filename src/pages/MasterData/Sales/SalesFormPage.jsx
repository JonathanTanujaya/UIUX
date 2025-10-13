import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { toast } from 'react-toastify';
import { salesAPI } from '../../../services/api';

function SalesFormPage() {
  const navigate = useNavigate();
  const { kodeSales } = useParams();
  const isEdit = !!kodeSales;
  
  const [formData, setFormData] = useState({
    namasales: '',
    alamat: '',
    nohp: '',
    target: '',
    status: 'Aktif',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Load data for editing
      loadSalesData();
    }
  }, [kodeSales, isEdit]);

  const loadSalesData = async () => {
    try {
      // const response = await salesAPI.getById(kodeSales);
      // setFormData(response.data);
      
      // Dummy data for editing
      setFormData({
        namasales: 'Ahmad Sutanto',
        alamat: 'Jl. Sudirman No. 123, Jakarta',
        nohp: '081234567890',
        target: '50000000',
        status: 'Aktif',
      });
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast.error('Gagal memuat data sales!');
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // await salesAPI.update(kodeSales, formData);
        toast.success('Sales berhasil diupdate!');
      } else {
        // Generate kode sales otomatis (misal: SLS + timestamp)
        const generatedKodeSales = 'SLS' + Date.now().toString().slice(-6);
        const salesData = { ...formData, kodesales: generatedKodeSales };
        
        // await salesAPI.create(salesData);
        console.log('Creating sales with data:', salesData);
        toast.success(`Sales berhasil ditambahkan dengan kode: ${generatedKodeSales}`);
      }
      navigate('/master/sales');
    } catch (err) {
      toast.error('Gagal menyimpan data!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Row 1: Nama Sales */}
              <Input 
                label="Nama Sales *" 
                name="namasales" 
                value={formData.namasales} 
                onChange={handleChange} 
                required
                placeholder="Masukkan nama sales..."
              />

              {/* Row 2: Alamat */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '6px' 
                }}>
                  Alamat *
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan alamat lengkap..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Row 3: No HP & Target */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input 
                  label="No HP *" 
                  name="nohp" 
                  value={formData.nohp} 
                  onChange={handleChange} 
                  required
                  placeholder="081234567890"
                />
                <Input 
                  label="Target Penjualan *" 
                  type="number" 
                  name="target" 
                  value={formData.target} 
                  onChange={handleChange} 
                  required
                  placeholder="50000000"
                />
              </div>

              {/* Row 4: Status */}
              <Select 
                label="Status *" 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </Select>

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
                  onClick={() => navigate('/master/sales')}
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
                    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
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

export default SalesFormPage;