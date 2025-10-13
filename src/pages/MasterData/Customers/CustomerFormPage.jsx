import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

function CustomerFormPage() {
  const navigate = useNavigate();
  const { kodeCustomer } = useParams();
  const isEdit = !!kodeCustomer;

  const [formData, setFormData] = useState({
    nama_customer: '',
    alamat: '',
    telepon: '',
    email: '',
    status: 'aktif'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Simulate loading data for edit
      // In real app, you would fetch from API
      const dummyData = {
        nama_customer: 'PT. Maju Jaya',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        telepon: '021-12345678',
        email: 'info@majujaya.com',
        status: 'aktif'
      };
      setFormData(dummyData);
    }
  }, [isEdit, kodeCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_customer.trim()) {
      newErrors.nama_customer = 'Nama customer wajib diisi';
    }
    
    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, you would call API here
      console.log(isEdit ? 'Updating customer:' : 'Creating customer:', formData);
      
      // Navigate back to list
      navigate('/master/customer');
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/master/customer');
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
              {/* Row 1: Nama Customer */}
              <Input
                label="Nama Customer *"
                name="nama_customer"
                value={formData.nama_customer}
                onChange={handleChange}
                error={errors.nama_customer}
                placeholder="Contoh: PT. Maju Jaya"
                required
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
                  Alamat <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${errors.alamat ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'vertical',
                    backgroundColor: 'white'
                  }}
                />
                {errors.alamat && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.alamat}
                  </p>
                )}
              </div>

              {/* Row 3: Telepon & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input
                  label="Telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  error={errors.telepon}
                  placeholder="Contoh: 021-12345678"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Contoh: info@customer.com"
                />
              </div>

              {/* Row 4: Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non Aktif</option>
                </select>
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
                  onClick={handleCancel}
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

export default CustomerFormPage;
