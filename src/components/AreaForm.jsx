import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { areaService } from '../config/apiService.js';

function AreaForm({ area, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeArea: '',
    Area: '',
    Status: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (area) {
      // Convert backend response to form format
      setFormData({
        KodeDivisi: area.kodedivisi || '',
        KodeArea: area.kodearea || '',
        Area: area.area || '',
        Status: area.status !== undefined ? area.status : true,
      });
    }
  }, [area]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.KodeDivisi.trim()) {
      newErrors.KodeDivisi = 'Kode Divisi harus diisi';
    }

    if (!formData.KodeArea.trim()) {
      newErrors.KodeArea = 'Kode Area harus diisi';
    }

    if (!formData.Area.trim()) {
      newErrors.Area = 'Nama Area harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let result;
      if (area) {
        // Update existing area
        result = await areaService.update(area.kodedivisi, area.kodearea, formData);
      } else {
        // Create new area
        result = await areaService.create(formData);
      }

      if (result.success) {
        toast.success(result.message);
        onSave();
      } else {
        toast.error(result.message);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('Error saving area:', error);
      toast.error('Terjadi kesalahan saat menyimpan area');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kode Divisi:</label>
        <input
          type="text"
          name="KodeDivisi"
          value={formData.KodeDivisi}
          onChange={handleChange}
          required
          disabled={loading}
        />
        {errors.KodeDivisi && <span style={{ color: 'red' }}>{errors.KodeDivisi}</span>}
      </div>
      <div>
        <label>Kode Area:</label>
        <input
          type="text"
          name="KodeArea"
          value={formData.KodeArea}
          onChange={handleChange}
          required
          disabled={loading}
        />
        {errors.KodeArea && <span style={{ color: 'red' }}>{errors.KodeArea}</span>}
      </div>
      <div>
        <label>Area:</label>
        <input
          type="text"
          name="Area"
          value={formData.Area}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.Area && <span style={{ color: 'red' }}>{errors.Area}</span>}
      </div>
      <div>
        <label>Status:</label>
        <input
          type="checkbox"
          name="Status"
          checked={formData.Status}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
      <button type="button" onClick={onCancel} disabled={loading}>
        Batal
      </button>
    </form>
  );
}

export default AreaForm;
