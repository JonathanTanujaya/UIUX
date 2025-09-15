import React from 'react';
import ReportTemplate from './ReportTemplate';

const PembelianItemReport = () => {
  const sampleData = [
    {
      id: 1,
      tanggal: '2025-01-15',
      no_po: 'PO-001',
      kode_barang: 'BRG001',
      nama_barang: 'Motor Oil 10W-40',
      qty: 50,
      harga: 45000,
      total: 2250000,
    },
    {
      id: 2,
      tanggal: '2025-01-15',
      no_po: 'PO-001',
      kode_barang: 'BRG002',
      nama_barang: 'Spark Plug NGK',
      qty: 100,
      harga: 25000,
      total: 2500000,
    },
  ];

  return (
    <ReportTemplate title="Laporan Pembelian Item">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. PO</th>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_po}</td>
                    <td>{item.kode_barang}</td>
                    <td>{item.nama_barang}</td>
                    <td className="text-right">{item.qty.toLocaleString()}</td>
                    <td className="text-right">Rp {item.harga.toLocaleString()}</td>
                    <td className="text-right">Rp {item.total.toLocaleString()}</td>
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

export default PembelianItemReport;
