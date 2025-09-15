import React from 'react';
import ReportTemplate from './ReportTemplate';

const PenjualanReport = () => {
  const sampleData = [
    {
      id: 1,
      tanggal: '2025-01-16',
      no_invoice: 'INV-001',
      customer: 'PT Customer Motor',
      sales: 'Ahmad',
      total: 1650000,
      status: 'Paid',
    },
    {
      id: 2,
      tanggal: '2025-01-15',
      no_invoice: 'INV-002',
      customer: 'CV Parts Motor',
      sales: 'Budi',
      total: 875000,
      status: 'Pending',
    },
  ];

  return (
    <ReportTemplate title="Laporan Penjualan">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Invoice</th>
                  <th>Customer</th>
                  <th>Sales</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_invoice}</td>
                    <td>{item.customer}</td>
                    <td>{item.sales}</td>
                    <td className="text-right">Rp {item.total.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${item.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}
                      >
                        {item.status}
                      </span>
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

export default PenjualanReport;
