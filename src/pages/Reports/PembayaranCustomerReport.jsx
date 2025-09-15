import React from 'react';
import ReportTemplate from './ReportTemplate';

const PembayaranCustomerReport = () => {
  const sampleData = [
    {
      id: 1,
      tanggal: '2025-01-18',
      no_pembayaran: 'PAY-001',
      customer: 'PT Customer Motor',
      no_invoice: 'INV-001',
      jumlah: 1815000,
      metode: 'Transfer Bank',
      status: 'Confirmed',
    },
    {
      id: 2,
      tanggal: '2025-01-17',
      no_pembayaran: 'PAY-002',
      customer: 'CV Parts Motor',
      no_invoice: 'INV-002',
      jumlah: 875000,
      metode: 'Cash',
      status: 'Confirmed',
    },
  ];

  return (
    <ReportTemplate title="Laporan Pembayaran Customer">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Pembayaran</th>
                  <th>Customer</th>
                  <th>No. Invoice</th>
                  <th>Jumlah</th>
                  <th>Metode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_pembayaran}</td>
                    <td>{item.customer}</td>
                    <td>{item.no_invoice}</td>
                    <td className="text-right">Rp {item.jumlah.toLocaleString()}</td>
                    <td>{item.metode}</td>
                    <td>
                      <span className="badge badge-success">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ReportTemplate>
  );
};

export default PembayaranCustomerReport;
