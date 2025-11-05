import React, { useState } from 'react';

const PenjualanReport = () => {
  // Sample data berdasarkan referensi gambar
  const [penjualanData] = useState([
    {
      no_invoice: '2025/07/AN/0008',
      tgl_faktur: '28/07/2025',
      kode_cust: '1GM',
      nama_cust: 'GELORA MOTOR',
      kode_area: '01',
      area: 'PALEMBANG',
      kode_sales: '001',
      nama_sales: 'KANTOR',
      tipe: 'K',
      jatuh_tempo: '26/10/2025',
      grand_total: 1560000.00,
      sisa_invoice: 1560000.00
    },
    {
      no_invoice: '2025/07/AN/0009',
      tgl_faktur: '29/07/2025',
      kode_cust: '2SM',
      nama_cust: 'SURYA MOTOR',
      kode_area: '02',
      area: 'JAKARTA',
      kode_sales: '002',
      nama_sales: 'BUDI SANTOSO',
      tipe: 'K',
      jatuh_tempo: '27/10/2025',
      grand_total: 2450000.00,
      sisa_invoice: 2450000.00
    },
    {
      no_invoice: '2025/07/AN/0010',
      tgl_faktur: '30/07/2025',
      kode_cust: '3AM',
      nama_cust: 'ANEKA MOTOR',
      kode_area: '03',
      area: 'BANDUNG',
      kode_sales: '003',
      nama_sales: 'SITI RAHAYU',
      tipe: 'T',
      jatuh_tempo: '28/10/2025',
      grand_total: 3200000.00,
      sisa_invoice: 1600000.00
    },
    {
      no_invoice: '2025/07/AN/0011',
      tgl_faktur: '31/07/2025',
      kode_cust: '4BM',
      nama_cust: 'BERKAH MOTOR',
      kode_area: '01',
      area: 'PALEMBANG',
      kode_sales: '001',
      nama_sales: 'KANTOR',
      tipe: 'K',
      jatuh_tempo: '29/10/2025',
      grand_total: 1850000.00,
      sisa_invoice: 1850000.00
    },
    {
      no_invoice: '2025/08/AN/0001',
      tgl_faktur: '01/08/2025',
      kode_cust: '5JM',
      nama_cust: 'JAYA MOTOR',
      kode_area: '04',
      area: 'SURABAYA',
      kode_sales: '004',
      nama_sales: 'AHMAD HIDAYAT',
      tipe: 'T',
      jatuh_tempo: '30/10/2025',
      grand_total: 2750000.00,
      sisa_invoice: 0.00
    },
    {
      no_invoice: '2025/08/AN/0002',
      tgl_faktur: '02/08/2025',
      kode_cust: '6RM',
      nama_cust: 'REJEKI MOTOR',
      kode_area: '02',
      area: 'JAKARTA',
      kode_sales: '002',
      nama_sales: 'BUDI SANTOSO',
      tipe: 'K',
      jatuh_tempo: '31/10/2025',
      grand_total: 4100000.00,
      sisa_invoice: 4100000.00
    },
    {
      no_invoice: '2025/08/AN/0003',
      tgl_faktur: '03/08/2025',
      kode_cust: '7MM',
      nama_cust: 'MAJU MOTOR',
      kode_area: '05',
      area: 'MEDAN',
      kode_sales: '005',
      nama_sales: 'DEWI SARTIKA',
      tipe: 'T',
      jatuh_tempo: '01/11/2025',
      grand_total: 1950000.00,
      sisa_invoice: 975000.00
    },
    {
      no_invoice: '2025/08/AN/0004',
      tgl_faktur: '04/08/2025',
      kode_cust: '8PM',
      nama_cust: 'PRIMA MOTOR',
      kode_area: '03',
      area: 'BANDUNG',
      kode_sales: '003',
      nama_sales: 'SITI RAHAYU',
      tipe: 'K',
      jatuh_tempo: '02/11/2025',
      grand_total: 3650000.00,
      sisa_invoice: 3650000.00
    },
    {
      no_invoice: '2025/08/AN/0005',
      tgl_faktur: '05/08/2025',
      kode_cust: '9UM',
      nama_cust: 'UNGGUL MOTOR',
      kode_area: '06',
      area: 'MAKASSAR',
      kode_sales: '006',
      nama_sales: 'RUDI HARTONO',
      tipe: 'T',
      jatuh_tempo: '03/11/2025',
      grand_total: 2300000.00,
      sisa_invoice: 2300000.00
    },
    {
      no_invoice: '2025/08/AN/0006',
      tgl_faktur: '06/08/2025',
      kode_cust: '10TM',
      nama_cust: 'TERANG MOTOR',
      kode_area: '01',
      area: 'PALEMBANG',
      kode_sales: '001',
      nama_sales: 'KANTOR',
      tipe: 'K',
      jatuh_tempo: '04/11/2025',
      grand_total: 5200000.00,
      sisa_invoice: 2600000.00
    }
  ]);

  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0], // Tanggal hari ini
    endDate: new Date().toISOString().split('T')[0]    // Tanggal hari ini
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleShowFilter = () => {
    // Logic untuk filter berdasarkan tanggal
    console.log('Filter applied:', dateFilter);
  };

  const totalAmount = penjualanData.reduce((sum, item) => sum + (item.grand_total || 0), 0);
  const totalSisa = penjualanData.reduce((sum, item) => sum + (item.sisa_invoice || 0), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filter Section */}
        <div className="p-4 bg-gray-100 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleShowFilter}
                className="px-4 py-1.5 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-600 border border-gray-400"
              >
                Show
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  No Invoice
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Tgl Faktur
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Cust
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Nama Cust
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Area
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Area
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Sales
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Nama Sales
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border border-gray-300">
                  Tipe
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Jatuh Tempo
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Grand Total
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Sisa Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {penjualanData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-3 py-8 text-center text-gray-500 border border-gray-300">
                    <div className="text-sm">
                      Drag a column header here to group by that column.
                    </div>
                  </td>
                </tr>
              ) : (
                penjualanData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs border border-gray-300 font-medium">
                      {item.no_invoice}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.tgl_faktur}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.kode_cust}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.nama_cust}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.kode_area}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.area}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.kode_sales}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.nama_sales}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-center">
                      {item.tipe}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.jatuh_tempo}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right font-medium">
                      {formatCurrency(item.grand_total)}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right font-medium">
                      {formatCurrency(item.sisa_invoice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer dengan Total dan Tombol Export */}
        <div className="p-3 bg-gray-100 border-t flex justify-between items-center">
          <div className="flex gap-4 text-sm font-medium text-gray-700">
            <span>Total = {formatCurrency(totalAmount)}</span>
            <span>Piutang = {formatCurrency(totalSisa)}</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjualanReport;
