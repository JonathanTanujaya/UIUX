import React from 'react';
import ReportTemplate from './ReportTemplate';

const PemotonganReturnCustomerReport = () => {
  const sampleData = [
    {
      id: 1,
      tanggal: '2025-01-19',
      no_pemotongan: 'POT-001',
      customer: 'PT Customer Motor',
      no_retur: 'RET-001',
      nilai_retur: 275000,
      potongan: 275000,
      sisa_tagihan: 1540000,
    },
    {
      id: 2,
      tanggal: '2025-01-18',
      no_pemotongan: 'POT-002',
      customer: 'CV Parts Motor',
      no_retur: 'RET-002',
      nilai_retur: 105000,
      potongan: 105000,
      sisa_tagihan: 770000,
    },
  ];

  return (
    <ReportTemplate title="Laporan Pemotongan Return Customer">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Pemotongan</th>
                  <th>Customer</th>
                  <th>No. Retur</th>
                  <th>Nilai Retur</th>
                  <th>Potongan</th>
                  <th>Sisa Tagihan</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_pemotongan}</td>
                    <td>{item.customer}</td>
                    <td>{item.no_retur}</td>
                    <td className="text-right">Rp {item.nilai_retur.toLocaleString()}</td>
                    <td className="text-right">Rp {item.potongan.toLocaleString()}</td>
                    <td className="text-right font-bold">
                      Rp {item.sisa_tagihan.toLocaleString()}
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

export default PemotonganReturnCustomerReport;
