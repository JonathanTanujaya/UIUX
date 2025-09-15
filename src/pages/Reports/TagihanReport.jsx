import React from 'react';
import ReportTemplate from './ReportTemplate';

const TagihanReport = () => {
  const sampleData = [
    {
      id: 1,
      no_invoice: 'INV-003',
      tanggal: '2025-01-15',
      customer: 'PT Motor ABC',
      total: 2500000,
      terbayar: 1000000,
      sisa: 1500000,
      jatuh_tempo: '2025-02-14',
      status: 'Overdue',
    },
    {
      id: 2,
      no_invoice: 'INV-004',
      tanggal: '2025-01-18',
      customer: 'CV Spare Parts',
      total: 1800000,
      terbayar: 0,
      sisa: 1800000,
      jatuh_tempo: '2025-02-17',
      status: 'Outstanding',
    },
  ];

  return (
    <ReportTemplate title="Laporan Tagihan">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Terbayar</th>
                  <th>Sisa</th>
                  <th>Jatuh Tempo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{item.no_invoice}</td>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.customer}</td>
                    <td className="text-right">Rp {item.total.toLocaleString()}</td>
                    <td className="text-right">Rp {item.terbayar.toLocaleString()}</td>
                    <td className="text-right font-bold">Rp {item.sisa.toLocaleString()}</td>
                    <td>{new Date(item.jatuh_tempo).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span
                        className={`badge ${item.status === 'Overdue' ? 'badge-danger' : 'badge-warning'}`}
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

export default TagihanReport;
