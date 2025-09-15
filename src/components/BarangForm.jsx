import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { barangService } from '../config/apiService.js';

function BarangForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeBarang: '',
    NamaBarang: '',
    KodeKategori: '',
    HargaList: '',
    HargaJual: '',
    HargaList2: '',
    HargaJual2: '',
    Satuan: '',
    Disc1: '',
    Disc2: '',
    merk: '',
    Barcode: '',
    status: true,
    Lokasi: '',
    StokMin: '',
    Checklist: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

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

    if (!formData.KodeBarang.trim()) {
      newErrors.KodeBarang = 'Kode Barang harus diisi';
    }

    if (!formData.NamaBarang.trim()) {
      newErrors.NamaBarang = 'Nama Barang harus diisi';
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
      if (item) {
        // Update existing item
        result = await barangService.update(item.KodeDivisi, item.KodeBarang, formData);
      } else {
        // Create new item
        result = await barangService.create(formData);
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
      console.error('Error saving barang:', error);
      toast.error('Terjadi kesalahan saat menyimpan barang');
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
        <label>Kode Barang:</label>
        <input
          type="text"
          name="KodeBarang"
          value={formData.KodeBarang}
          onChange={handleChange}
          required
          disabled={loading}
        />
        {errors.KodeBarang && <span style={{ color: 'red' }}>{errors.KodeBarang}</span>}
      </div>
      <div>
        <label>Nama Barang:</label>
        <input
          type="text"
          name="NamaBarang"
          value={formData.NamaBarang}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.NamaBarang && <span style={{ color: 'red' }}>{errors.NamaBarang}</span>}
      </div>
      <div>
        <label>Kode Kategori:</label>
        <input
          type="text"
          name="KodeKategori"
          value={formData.KodeKategori}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Harga List:</label>
        <input type="number" name="HargaList" value={formData.HargaList} onChange={handleChange} />
      </div>
      <div>
        <label>Harga Jual:</label>
        <input type="number" name="HargaJual" value={formData.HargaJual} onChange={handleChange} />
      </div>
      <div>
        <label>Harga List 2:</label>
        <input
          type="number"
          name="HargaList2"
          value={formData.HargaList2}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Harga Jual 2:</label>
        <input
          type="number"
          name="HargaJual2"
          value={formData.HargaJual2}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Satuan:</label>
        <input type="text" name="Satuan" value={formData.Satuan} onChange={handleChange} />
      </div>
      <div>
        <label>Disc 1:</label>
        <input type="number" name="Disc1" value={formData.Disc1} onChange={handleChange} />
      </div>
      <div>
        <label>Disc 2:</label>
        <input type="number" name="Disc2" value={formData.Disc2} onChange={handleChange} />
      </div>
      <div>
        <label>Merk:</label>
        <input type="text" name="merk" value={formData.merk} onChange={handleChange} />
      </div>
      <div>
        <label>Barcode:</label>
        <input type="text" name="Barcode" value={formData.Barcode} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
      </div>
      <div>
        <label>Lokasi:</label>
        <input type="text" name="Lokasi" value={formData.Lokasi} onChange={handleChange} />
      </div>
      <div>
        <label>Stok Min:</label>
        <input type="number" name="StokMin" value={formData.StokMin} onChange={handleChange} />
      </div>
      <div>
        <label>Checklist:</label>
        <input
          type="checkbox"
          name="Checklist"
          checked={formData.Checklist}
          onChange={handleChange}
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

export default BarangForm;
