import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { toast } from 'react-toastify';

function AreaFormPage() {
  const navigate = useNavigate();
  const { kodeArea } = useParams();
  const isEdit = !!kodeArea;
  
  const [formData, setFormData] = useState({
    nama_area: '',
    wilayah: '',
    provinsi: '',
    keterangan: '',
    status: 'Aktif',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Load data for editing
      loadAreaData();
    }
  }, [kodeArea, isEdit]);

  const loadAreaData = async () => {
    try {
      // Dummy data for editing
      setFormData({
        nama_area: 'Jakarta Utara',
        wilayah: 'DKI Jakarta',
        provinsi: 'DKI Jakarta',
        keterangan: 'Area Jakarta Utara dan sekitarnya',
        status: 'Aktif',
      });
    } catch (error) {
      console.error('Error loading area data:', error);
      toast.error('Gagal memuat data area!');
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
        toast.success('Area berhasil diupdate!');
      } else {
        // Generate kode area otomatis (misal: ARE + timestamp)
        const generatedKodeArea = 'ARE' + Date.now().toString().slice(-6);
        const areaData = { ...formData, kode_area: generatedKodeArea };
        
        console.log('Creating area with data:', areaData);
        toast.success(`Area berhasil ditambahkan dengan kode: ${generatedKodeArea}`);
      }
      navigate('/master/area');
    } catch (err) {
      toast.error('Gagal menyimpan data!');
    } finally {
      setLoading(false);
    }
  };

  const provinsiOptions = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Sumatera Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Bali',
    'Kalimantan Timur',
    'Sulawesi Selatan'
  ];

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
              {/* Row 1: Nama Area */}
              <Input 
                label="Nama Area *" 
                name="nama_area" 
                value={formData.nama_area} 
                onChange={handleChange} 
                required
                placeholder="Jakarta Utara"
              />

              {/* Row 2: Wilayah & Provinsi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input 
                  label="Wilayah *" 
                  name="wilayah" 
                  value={formData.wilayah} 
                  onChange={handleChange} 
                  required
                  placeholder="DKI Jakarta"
                />
                <Select 
                  label="Provinsi *" 
                  name="provinsi" 
                  value={formData.provinsi} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Pilih Provinsi</option>
                  {provinsiOptions.map(provinsi => (
                    <option key={provinsi} value={provinsi}>
                      {provinsi}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Row 3: Keterangan */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '6px' 
                }}>
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  placeholder="Masukkan keterangan area..."
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

              {/* Row 4: Status */}
              <Select 
                label="Status *" 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
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
                  onClick={() => navigate('/master/area')}
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

export default AreaFormPage;