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
    nama_area: '',
    alamat: '',
    no_telpon: '',
    contact: '',
    credit_limit: '',
    jatuh_tempo: '',
    no_npwp: '',
    nik: '',
    nama_pajak: '',
    alamat_pajak: ''
  });

  const [activeTab, setActiveTab] = useState('umum');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    contact: true,
    financial: true,
    legal: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (isEdit) {
      // Simulate loading data for edit
      // In real app, you would fetch from API
      const dummyData = {
        nama_customer: 'PT. Maju Jaya',
        nama_area: 'Jakarta Selatan',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        no_telpon: '081234567890',
        contact: 'Budi Santoso',
        credit_limit: '50000000',
        jatuh_tempo: '30',
        no_npwp: '01.234.567.8-901.000',
        nik: '3174012345670001',
        nama_pajak: 'PT. Maju Jaya',
        alamat_pajak: 'Jl. Sudirman No. 123, Jakarta Selatan'
      };
      setFormData(dummyData);
    }
  }, [isEdit, kodeCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for NIK - only allow 16 digits
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 16) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      return;
    }

    // Special handling for NPWP - format as XX.XXX.XXX.X-XXX.XXX
    if (name === 'no_npwp') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (numericValue.length > 0) {
        formattedValue = numericValue.substring(0, 2);
        if (numericValue.length > 2) {
          formattedValue += '.' + numericValue.substring(2, 5);
        }
        if (numericValue.length > 5) {
          formattedValue += '.' + numericValue.substring(5, 8);
        }
        if (numericValue.length > 8) {
          formattedValue += '.' + numericValue.substring(8, 9);
        }
        if (numericValue.length > 9) {
          formattedValue += '-' + numericValue.substring(9, 12);
        }
        if (numericValue.length > 12) {
          formattedValue += '.' + numericValue.substring(12, 15);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      return;
    }

    // Special handling for Jatuh Tempo - only allow 3 digits
    if (name === 'jatuh_tempo') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 3) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      return;
    }
    
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
    
    if (!formData.nama_area.trim()) {
      newErrors.nama_area = 'Area wajib dipilih';
    }
    
    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (!formData.no_telpon.trim()) {
      newErrors.no_telpon = 'No Telpon wajib diisi';
    }

    // Validate NIK if filled - must be exactly 16 digits
    if (formData.nik && formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit';
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
    <div style={{ 
      boxSizing: 'border-box',
      backgroundColor: '#f9fafb',
      height: '100%',
      padding: '0',
      overflow: 'auto'
    }}>
      {/* Form Card */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        minHeight: '100%'
      }}>
        <form onSubmit={handleSubmit}>
          {/* 2 Column Layout */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Kolom Kiri */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '2px', paddingBottom: '2px', borderBottom: '2px solid #e5e7eb' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Informasi Customer</h3>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Kode Customer
                </label>
                <input
                  type="text"
                  name="kode_customer"
                  value={formData.kode_customer || ''}
                  readOnly
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    color: '#64748b'
                  }}
                  placeholder="Auto generate"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Nama Customer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="nama_customer"
                  value={formData.nama_customer}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: `1px solid ${errors.nama_customer ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.nama_customer ? '#ef4444' : '#d1d5db'}
                  placeholder="Contoh: PT. Maju Jaya"
                />
                {errors.nama_customer && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nama_customer}</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Kode Area <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="nama_area"
                  value={formData.nama_area}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: `1px solid ${errors.nama_area ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.nama_area ? '#ef4444' : '#d1d5db'}
                >
                  <option value="">Pilih Area</option>
                  <option value="Jakarta Pusat">Jakarta Pusat</option>
                  <option value="Jakarta Utara">Jakarta Utara</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Jakarta Barat">Jakarta Barat</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Depok">Depok</option>
                </select>
                {errors.nama_area && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nama_area}</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Alamat <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${errors.alamat ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'vertical',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.alamat ? '#ef4444' : '#d1d5db'}
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                />
                {errors.alamat && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.alamat}</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Telepon <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="no_telpon"
                  value={formData.no_telpon}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: `1px solid ${errors.no_telpon ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.no_telpon ? '#ef4444' : '#d1d5db'}
                  placeholder="Contoh: 081234567890"
                />
                {errors.no_telpon && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.no_telpon}</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '2px', paddingBottom: '2px', borderBottom: '2px solid #e5e7eb' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Informasi Pajak & Keuangan</h3>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  No NPWP
                </label>
                <input
                  type="text"
                  name="no_npwp"
                  value={formData.no_npwp}
                  onChange={handleChange}
                  maxLength="20"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="XX.XXX.XXX.X-XXX.XXX"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  NIK
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength="16"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: `1px solid ${errors.nik ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.nik ? '#ef4444' : '#d1d5db'}
                  placeholder="16 digit"
                />
                {errors.nik && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nik}</p>}
                {!errors.nik && formData.nik && (
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                    {formData.nik.length}/16 digit
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Nama Pajak
                </label>
                <input
                  type="text"
                  name="nama_pajak"
                  value={formData.nama_pajak}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Contoh: PT. Maju Jaya"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Alamat Pajak
                </label>
                <textarea
                  name="alamat_pajak"
                  value={formData.alamat_pajak}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'vertical',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Credit Limit
                </label>
                <input
                  type="number"
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Contoh: 50000000"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                  Jatuh Tempo (Hari)
                </label>
                <input
                  type="text"
                  name="jatuh_tempo"
                  value={formData.jatuh_tempo}
                  onChange={handleChange}
                  maxLength="3"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Contoh: 30"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      height: '44px',
                      padding: '0 28px',
                      backgroundColor: 'white',
                      color: '#475569',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.borderColor = '#94a3b8';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      height: '44px',
                      padding: '0 32px',
                      backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#2563eb'; }}
                    onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#3b82f6'; }}
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFormPage;
