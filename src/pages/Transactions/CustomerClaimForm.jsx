import React, { useState, useEffect } from 'react';
import '../../design-system.css';

const CustomerClaimForm = () => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    customer_id: '',
    no_invoice: '',
    jenis_claim: '',
    keterangan: '',
    total_claim: 0,
  });

  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Sample data - replace with actual API call
      const sampleData = [
        { id: 1, nama: 'PT Customer Motor', alamat: 'Jakarta' },
        { id: 2, nama: 'CV Parts Motor', alamat: 'Bandung' },
        { id: 3, nama: 'UD Motor Jaya', alamat: 'Surabaya' },
      ];
      setCustomers(sampleData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchInvoices = async customerId => {
    try {
      // Sample data - replace with actual API call
      const sampleData = [
        { id: 1, no_invoice: 'INV-001', tanggal: '2025-01-16', total: 1815000 },
        { id: 2, no_invoice: 'INV-002', tanggal: '2025-01-15', total: 875000 },
      ];
      setInvoices(sampleData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'customer_id' && value) {
      fetchInvoices(value);
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      kode_barang: '',
      nama_barang: '',
      qty: 0,
      harga: 0,
      total: 0,
      alasan: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = id => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'harga') {
          updatedItem.total = updatedItem.qty * updatedItem.harga;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);

    // Update total claim
    const totalClaim = updatedItems.reduce((total, item) => total + item.total, 0);
    setFormData(prev => ({ ...prev, total_claim: totalClaim }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const claimData = {
        ...formData,
        items: items,
      };

      // TODO: API call to save customer claim
      console.log('Customer Claim Data:', claimData);
      alert('Customer claim berhasil disimpan!');

      // Reset form
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        customer_id: '',
        no_invoice: '',
        jenis_claim: '',
        keterangan: '',
        total_claim: 0,
      });
      setItems([]);
    } catch (error) {
      console.error('Error saving customer claim:', error);
      alert('Error saving customer claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Informasi Claim</h3>
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
                <label className="form-label">Customer</label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.nama} - {customer.alamat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">No. Invoice</label>
                <select
                  name="no_invoice"
                  value={formData.no_invoice}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Invoice</option>
                  {invoices.map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.no_invoice} - {new Date(invoice.tanggal).toLocaleDateString('id-ID')}{' '}
                      (Rp {invoice.total.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Claim</label>
                <select
                  name="jenis_claim"
                  value={formData.jenis_claim}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Jenis Claim</option>
                  <option value="Barang Rusak">Barang Rusak</option>
                  <option value="Barang Hilang">Barang Hilang</option>
                  <option value="Kualitas Buruk">Kualitas Buruk</option>
                  <option value="Keterlambatan">Keterlambatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Keterangan</label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Keterangan detail claim dari customer"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Item Claim</h3>
            <button type="button" className="btn btn-primary btn-sm" onClick={addItem}>
              Tambah Item
            </button>
          </div>
          <div className="card-body">
            {items.length === 0 ? (
              <p className="text-muted">
                Belum ada item claim. Klik "Tambah Item" untuk menambahkan.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Kode Barang</th>
                      <th>Nama Barang</th>
                      <th>Qty</th>
                      <th>Harga</th>
                      <th>Total</th>
                      <th>Alasan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.kode_barang}
                            onChange={e => updateItem(item.id, 'kode_barang', e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Kode"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.nama_barang}
                            onChange={e => updateItem(item.id, 'nama_barang', e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Nama Barang"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e =>
                              updateItem(item.id, 'qty', parseInt(e.target.value) || 0)
                            }
                            className="form-control form-control-sm"
                            style={{ width: '80px' }}
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.harga}
                            onChange={e =>
                              updateItem(item.id, 'harga', parseInt(e.target.value) || 0)
                            }
                            className="form-control form-control-sm"
                            style={{ width: '100px' }}
                            min="0"
                          />
                        </td>
                        <td className="text-right">Rp {item.total.toLocaleString()}</td>
                        <td>
                          <input
                            type="text"
                            value={item.alasan}
                            onChange={e => updateItem(item.id, 'alasan', e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Alasan"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeItem(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Claim</h3>
          </div>
          <div className="card-body">
            <div className="total-summary">
              <div className="total-row">
                <span>Total Claim:</span>
                <span className="total-amount">Rp {formData.total_claim.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Menyimpan...' : 'Simpan Claim'}
          </button>
          <button type="button" className="btn btn-secondary">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerClaimForm;
