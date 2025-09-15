import React, { useState, useEffect } from 'react';
import '../../design-system.css';

const InvoiceCancelForm = () => {
  const [formData, setFormData] = useState({
    no_invoice: '',
    tanggal_cancel: new Date().toISOString().split('T')[0],
    alasan: '',
    catatan: '',
  });

  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Sample data - replace with actual API call
      const sampleData = [
        {
          id: 1,
          no_invoice: 'INV-001',
          tanggal: '2025-01-16',
          customer: 'PT Customer Motor',
          total: 1815000,
          status: 'Active',
        },
        {
          id: 2,
          no_invoice: 'INV-002',
          tanggal: '2025-01-15',
          customer: 'CV Parts Motor',
          total: 875000,
          status: 'Active',
        },
      ];
      setInvoiceList(sampleData);
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

    if (name === 'no_invoice') {
      const invoice = invoiceList.find(inv => inv.id == value);
      setSelectedInvoice(invoice);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to cancel invoice
      console.log('Cancel Invoice Data:', formData);
      alert('Invoice berhasil dibatalkan!');

      // Reset form
      setFormData({
        no_invoice: '',
        tanggal_cancel: new Date().toISOString().split('T')[0],
        alasan: '',
        catatan: '',
      });
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error canceling invoice:', error);
      alert('Error canceling invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pilih Invoice</h3>
          </div>
          <div className="card-body">
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
                {invoiceList.map(invoice => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.no_invoice} - {invoice.customer} (Rp {invoice.total.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div className="invoice-detail mt-4">
                <h4>Detail Invoice</h4>
                <div className="form-grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Tanggal Invoice</label>
                    <p className="form-text">
                      {new Date(selectedInvoice.tanggal).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer</label>
                    <p className="form-text">{selectedInvoice.customer}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total</label>
                    <p className="form-text">Rp {selectedInvoice.total.toLocaleString()}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <p className="form-text">
                      <span className="badge badge-success">{selectedInvoice.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alasan Pembatalan</h3>
          </div>
          <div className="card-body">
            <div className="form-grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Tanggal Cancel</label>
                <input
                  type="date"
                  name="tanggal_cancel"
                  value={formData.tanggal_cancel}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alasan</label>
                <select
                  name="alasan"
                  value={formData.alasan}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Alasan</option>
                  <option value="Kesalahan Input">Kesalahan Input</option>
                  <option value="Permintaan Customer">Permintaan Customer</option>
                  <option value="Barang Tidak Tersedia">Barang Tidak Tersedia</option>
                  <option value="Duplikasi Invoice">Duplikasi Invoice</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Catatan</label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Catatan tambahan untuk pembatalan invoice"
              ></textarea>
            </div>

            <div className="alert alert-warning">
              <strong>Peringatan:</strong> Invoice yang dibatalkan tidak dapat dikembalikan.
              Pastikan Anda yakin dengan pembatalan ini.
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-danger" disabled={loading || !selectedInvoice}>
            {loading ? 'Membatalkan...' : 'Batalkan Invoice'}
          </button>
          <button type="button" className="btn btn-secondary">
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCancelForm;
