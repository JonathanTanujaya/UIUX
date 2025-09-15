import React from 'react';
import ReportTemplate from './ReportTemplate';

const COGSReport = () => {
  const sampleData = [
    {
      id: 1,
      kode_barang: 'BRG001',
      nama_barang: 'Motor Oil 10W-40',
      qty_jual: 30,
      hpp: 45000,
      total_hpp: 1350000,
      harga_jual: 55000,
      total_jual: 1650000,
      profit: 300000,
    },
    {
      id: 2,
      kode_barang: 'BRG002',
      nama_barang: 'Spark Plug NGK',
      qty_jual: 25,
      hpp: 25000,
      total_hpp: 625000,
      harga_jual: 35000,
      total_jual: 875000,
      profit: 250000,
    },
  ];

  return (
    <ReportTemplate title="Laporan COGS (Cost of Goods Sold)">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Qty Jual</th>
                  <th>HPP</th>
                  <th>Total HPP</th>
                  <th>Harga Jual</th>
                  <th>Total Jual</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(item => (
                  <tr key={item.id}>
                    <td>{item.kode_barang}</td>
                    <td>{item.nama_barang}</td>
                    <td className="text-right">{item.qty_jual.toLocaleString()}</td>
                    <td className="text-right">Rp {item.hpp.toLocaleString()}</td>
                    <td className="text-right">Rp {item.total_hpp.toLocaleString()}</td>
                    <td className="text-right">Rp {item.harga_jual.toLocaleString()}</td>
                    <td className="text-right">Rp {item.total_jual.toLocaleString()}</td>
                    <td className="text-right text-success">Rp {item.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colspan="4">Total</td>
                  <td className="text-right">Rp 1,975,000</td>
                  <td></td>
                  <td className="text-right">Rp 2,525,000</td>
                  <td className="text-right text-success">Rp 550,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </ReportTemplate>
  );
};

export default COGSReport;
