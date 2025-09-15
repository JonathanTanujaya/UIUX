import React from 'react';
import ReportTemplate from './ReportTemplate';

const ReturnSalesReport = () => {
  const sampleData = [
    {
      id: 1,
      tanggal: '2025-01-17',
      no_retur: 'RET-001',
      no_invoice: 'INV-001',
      customer: 'PT Customer Motor',
      kode_barang: 'BRG001',
      qty: 5,
      alasan: 'Barang Rusak',
      nilai: 275000,
    },
    {
      id: 2,
      tanggal: '2025-01-16',
      no_retur: 'RET-002',
      no_invoice: 'INV-002',
      customer: 'CV Parts Motor',
      kode_barang: 'BRG002',
      qty: 3,
      alasan: 'Salah Order',
      nilai: 105000,
    },
  ];

  return (
    <ReportTemplate title="Laporan Return Sales">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Retur</th>
                  <th>No. Invoice</th>
                  <th>Customer</th>
                  <th>Kode Barang</th>
                  <th>Qty</th>
                  <th>Alasan</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_retur}</td>
                    <td>{item.no_invoice}</td>
                    <td>{item.customer}</td>
                    <td>{item.kode_barang}</td>
                    <td className="text-right">{item.qty.toLocaleString()}</td>
                    <td>{item.alasan}</td>
                    <td className="text-right">Rp {item.nilai.toLocaleString()}</td>
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

export default ReturnSalesReport;
