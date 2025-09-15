import React from 'react';
import ReportTemplate from './ReportTemplate';

const KomisiSalesReport = () => {
  const sampleData = [
    {
      id: 1,
      periode: 'Januari 2025',
      sales: 'Ahmad',
      target: 10000000,
      realisasi: 12500000,
      persentase: 125,
      komisi_persen: 5,
      komisi: 625000,
      bonus: 100000,
      total: 725000,
    },
    {
      id: 2,
      periode: 'Januari 2025',
      sales: 'Budi',
      target: 8000000,
      realisasi: 7500000,
      persentase: 94,
      komisi_persen: 3,
      komisi: 225000,
      bonus: 0,
      total: 225000,
    },
    {
      id: 3,
      periode: 'Januari 2025',
      sales: 'Cici',
      target: 12000000,
      realisasi: 15000000,
      persentase: 125,
      komisi_persen: 5,
      komisi: 750000,
      bonus: 150000,
      total: 900000,
    },
  ];

  return (
    <ReportTemplate title="Laporan Komisi Sales">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Sales</th>
                  <th>Target</th>
                  <th>Realisasi</th>
                  <th>%</th>
                  <th>Komisi %</th>
                  <th>Komisi</th>
                  <th>Bonus</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{item.periode}</td>
                    <td>{item.sales}</td>
                    <td className="text-right">Rp {item.target.toLocaleString()}</td>
                    <td className="text-right">Rp {item.realisasi.toLocaleString()}</td>
                    <td className="text-right">{item.persentase}%</td>
                    <td className="text-right">{item.komisi_persen}%</td>
                    <td className="text-right">Rp {item.komisi.toLocaleString()}</td>
                    <td className="text-right">Rp {item.bonus.toLocaleString()}</td>
                    <td className="text-right font-bold">Rp {item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colspan="6">Total</td>
                  <td className="text-right">Rp 1,600,000</td>
                  <td className="text-right">Rp 250,000</td>
                  <td className="text-right">Rp 1,850,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </ReportTemplate>
  );
};

export default KomisiSalesReport;
