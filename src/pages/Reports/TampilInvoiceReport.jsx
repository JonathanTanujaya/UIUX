import React from 'react';
import ReportTemplate from './ReportTemplate';

const TampilInvoiceReport = () => {
  const sampleData = [
    {
      id: 1,
      no_invoice: 'INV-001',
      tanggal: '2025-01-16',
      customer: 'PT Customer Motor',
      items: [{ kode: 'BRG001', nama: 'Motor Oil 10W-40', qty: 30, harga: 55000, total: 1650000 }],
      subtotal: 1650000,
      diskon: 0,
      pajak: 165000,
      total: 1815000,
    },
  ];

  return (
    <ReportTemplate title="Tampil Invoice">
      {sampleData.map(invoice => (
        <div key={invoice.id} className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Invoice {invoice.no_invoice}</h3>
          </div>
          <div className="card-body">
            <div className="invoice-header mb-4">
              <div className="form-grid grid-cols-2">
                <div>
                  <p>
                    <strong>Tanggal:</strong>{' '}
                    {new Date(invoice.tanggal).toLocaleDateString('id-ID')}
                  </p>
                  <p>
                    <strong>Customer:</strong> {invoice.customer}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>No. Invoice:</strong> {invoice.no_invoice}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="badge badge-success">Paid</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="table-responsive mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Barang</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kode}</td>
                      <td>{item.nama}</td>
                      <td className="text-right">{item.qty.toLocaleString()}</td>
                      <td className="text-right">Rp {item.harga.toLocaleString()}</td>
                      <td className="text-right">Rp {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoice-footer">
              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <table className="table table-sm">
                    <tr>
                      <td>Subtotal:</td>
                      <td className="text-right">Rp {invoice.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Diskon:</td>
                      <td className="text-right">Rp {invoice.diskon.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Pajak (10%):</td>
                      <td className="text-right">Rp {invoice.pajak.toLocaleString()}</td>
                    </tr>
                    <tr className="font-bold">
                      <td>Total:</td>
                      <td className="text-right">Rp {invoice.total.toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ReportTemplate>
  );
};

export default TampilInvoiceReport;
