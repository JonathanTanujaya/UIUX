import React, { useState, useEffect } from 'react';
import '../../design-system.css';

const StokOpnameForm = () => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    kategori: '',
    lokasi: '',
  });

  const [items, setItems] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      // Sample data - replace with actual API call
      const sampleData = [
        { id: 1, kode: 'BRG001', nama: 'Motor Oil 10W-40', stok_sistem: 120, stok_fisik: 0 },
        { id: 2, kode: 'BRG002', nama: 'Spark Plug NGK', stok_sistem: 220, stok_fisik: 0 },
        { id: 3, kode: 'BRG003', nama: 'Air Filter', stok_sistem: 80, stok_fisik: 0 },
      ];
      setBarangList(sampleData);
      setItems(sampleData);
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

  const handleStokFisikChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].stok_fisik = parseInt(value) || 0;
    updatedItems[index].selisih = updatedItems[index].stok_fisik - updatedItems[index].stok_sistem;
    setItems(updatedItems);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const opnameData = {
        ...formData,
        items: items.filter(item => item.stok_fisik > 0 || item.selisih !== 0),
      };

      // TODO: API call to save stok opname
      console.log('Stok Opname Data:', opnameData);
      alert('Stok opname berhasil disimpan!');

      // Reset form
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        kategori: '',
        lokasi: '',
      });
      fetchBarang(); // Reload data
    } catch (error) {
      console.error('Error saving stok opname:', error);
      alert('Error saving stok opname');
    } finally {
      setLoading(false);
    }
  };

  const getTotalSelisih = () => {
    return items.reduce((total, item) => total + (item.selisih || 0), 0);
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Informasi Opname</h3>
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
                <label className="form-label">Kategori</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Semua Kategori</option>
                  <option value="oli">Oli & Pelumas</option>
                  <option value="spare-parts">Spare Parts</option>
                  <option value="aksesoris">Aksesoris</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lokasi</label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Lokasi gudang/rak"
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
                  placeholder="Keterangan opname"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Data Stok Opname</h3>
            <div className="card-actions">
              <span className="badge badge-info">Total Selisih: {getTotalSelisih()}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Barang</th>
                    <th>Stok Sistem</th>
                    <th>Stok Fisik</th>
                    <th>Selisih</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.kode}</td>
                      <td>{item.nama}</td>
                      <td className="text-right">{item.stok_sistem}</td>
                      <td>
                        <input
                          type="number"
                          value={item.stok_fisik}
                          onChange={e => handleStokFisikChange(index, e.target.value)}
                          className="form-control form-control-sm"
                          style={{ width: '100px' }}
                          min="0"
                        />
                      </td>
                      <td
                        className={`text-right ${item.selisih > 0 ? 'text-success' : item.selisih < 0 ? 'text-danger' : ''}`}
                      >
                        {item.selisih || 0}
                      </td>
                      <td>
                        {item.selisih > 0 && <span className="badge badge-success">Lebih</span>}
                        {item.selisih < 0 && <span className="badge badge-danger">Kurang</span>}
                        {item.selisih === 0 && (
                          <span className="badge badge-secondary">Sesuai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ringkasan</h3>
          </div>
          <div className="card-body">
            <div className="form-grid grid-cols-3">
              <div className="summary-box">
                <div className="summary-label">Total Item</div>
                <div className="summary-value">{items.length}</div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Item dengan Selisih</div>
                <div className="summary-value">
                  {items.filter(item => item.selisih !== 0).length}
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-label">Total Selisih</div>
                <div
                  className={`summary-value ${getTotalSelisih() > 0 ? 'text-success' : getTotalSelisih() < 0 ? 'text-danger' : ''}`}
                >
                  {getTotalSelisih()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Opname'}
          </button>
          <button type="button" className="btn btn-secondary">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default StokOpnameForm;
