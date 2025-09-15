import React, { useState, useEffect } from 'react';
import '../../design-system.css';

const MergeBarangForm = () => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    barang_asal: '',
    barang_tujuan: '',
    qty_merge: 0,
  });

  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      // Sample data - replace with actual API call
      const sampleData = [
        { id: 1, kode: 'BRG001', nama: 'Motor Oil 10W-40', stok: 120 },
        { id: 2, kode: 'BRG002', nama: 'Spark Plug NGK', stok: 220 },
        { id: 3, kode: 'BRG003', nama: 'Air Filter', stok: 80 },
      ];
      setBarangList(sampleData);
    } catch (error) {
      console.error('Error fetching barang:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to save merge barang
      console.log('Merge Barang Data:', formData);
      alert('Merge barang berhasil disimpan!');

      // Reset form
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        barang_asal: '',
        barang_tujuan: '',
        qty_merge: 0,
      });
    } catch (error) {
      console.error('Error saving merge barang:', error);
      alert('Error saving merge barang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Informasi Merge</h3>
          </div>
          <div className="card-body">
            <div className="form-grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Keterangan</label>
                <input
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Keterangan merge barang"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Detail Merge</h3>
          </div>
          <div className="card-body">
            <div className="form-grid grid-cols-3">
              <div className="form-group">
                <label className="form-label">Barang Asal</label>
                <select
                  name="barang_asal"
                  value={formData.barang_asal}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Barang Asal</option>
                  {barangList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.kode} - {item.nama} (Stok: {item.stok})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Barang Tujuan</label>
                <select
                  name="barang_tujuan"
                  value={formData.barang_tujuan}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Barang Tujuan</option>
                  {barangList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.kode} - {item.nama} (Stok: {item.stok})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Qty Merge</label>
                <input
                  type="number"
                  name="qty_merge"
                  value={formData.qty_merge}
                  onChange={handleInputChange}
                  className="form-control"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="alert alert-info">
              <strong>Info:</strong> Stok dari barang asal akan dikurangi dan ditambahkan ke barang
              tujuan.
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Merge'}
          </button>
          <button type="button" className="btn btn-secondary">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default MergeBarangForm;
