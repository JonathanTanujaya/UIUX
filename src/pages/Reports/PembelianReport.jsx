import React, { useState } from 'react';

const PembelianReport = () => {
  // Sample data berdasarkan referensi gambar
  const [pembelianData] = useState([
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-001',
      tgl_penerimaan: '28/07/2025',
      kode_supplier: 'SUP001',
      nama_supplier: 'PT CASTROL INDONESIA',
      jatuh_tempo: '27/08/2025',
      no_faktur: 'INV-CST-001',
      total: 15000000.00,
      discount: 750000.00,
      pajak: 1575000.00,
      grand_total: 15825000.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-002',
      tgl_penerimaan: '29/07/2025',
      kode_supplier: 'SUP002',
      nama_supplier: 'NGK SPARK PLUGS',
      jatuh_tempo: '28/08/2025',
      no_faktur: 'INV-NGK-002',
      total: 8500000.00,
      discount: 425000.00,
      pajak: 885500.00,
      grand_total: 8960500.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-003',
      tgl_penerimaan: '30/07/2025',
      kode_supplier: 'SUP003',
      nama_supplier: 'FEDERAL PARTS',
      jatuh_tempo: '29/08/2025',
      no_faktur: 'INV-FED-003',
      total: 12300000.00,
      discount: 615000.00,
      pajak: 1284500.00,
      grand_total: 12969500.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-004',
      tgl_penerimaan: '31/07/2025',
      kode_supplier: 'SUP004',
      nama_supplier: 'DENSO INDONESIA',
      jatuh_tempo: '30/08/2025',
      no_faktur: 'INV-DNS-004',
      total: 9800000.00,
      discount: 490000.00,
      pajak: 1023100.00,
      grand_total: 10333100.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-005',
      tgl_penerimaan: '01/08/2025',
      kode_supplier: 'SUP005',
      nama_supplier: 'BOSCH INDONESIA',
      jatuh_tempo: '31/08/2025',
      no_faktur: 'INV-BSH-005',
      total: 18700000.00,
      discount: 935000.00,
      pajak: 1954150.00,
      grand_total: 19719150.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-006',
      tgl_penerimaan: '02/08/2025',
      kode_supplier: 'SUP006',
      nama_supplier: 'MOBIL 1 INDONESIA',
      jatuh_tempo: '01/09/2025',
      no_faktur: 'INV-MB1-006',
      total: 14200000.00,
      discount: 710000.00,
      pajak: 1483900.00,
      grand_total: 14973900.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-007',
      tgl_penerimaan: '03/08/2025',
      kode_supplier: 'SUP007',
      nama_supplier: 'ASPIRA INDONESIA',
      jatuh_tempo: '02/09/2025',
      no_faktur: 'INV-ASP-007',
      total: 7600000.00,
      discount: 380000.00,
      pajak: 794600.00,
      grand_total: 8014600.00,
      status: 'Draft'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-008',
      tgl_penerimaan: '04/08/2025',
      kode_supplier: 'SUP008',
      nama_supplier: 'TOYOTA GENUINE PARTS',
      jatuh_tempo: '03/09/2025',
      no_faktur: 'INV-TGP-008',
      total: 22500000.00,
      discount: 1125000.00,
      pajak: 2351250.00,
      grand_total: 23726250.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-009',
      tgl_penerimaan: '05/08/2025',
      kode_supplier: 'SUP009',
      nama_supplier: 'HONDA GENUINE PARTS',
      jatuh_tempo: '04/09/2025',
      no_faktur: 'INV-HGP-009',
      total: 16800000.00,
      discount: 840000.00,
      pajak: 1755600.00,
      grand_total: 17715600.00,
      status: 'Posted'
    },
    {
      kode_divisi: 'PLB',
      no_penerimaan: 'RCV-2025-010',
      tgl_penerimaan: '06/08/2025',
      kode_supplier: 'SUP010',
      nama_supplier: 'SUZUKI GENUINE PARTS',
      jatuh_tempo: '05/09/2025',
      no_faktur: 'INV-SGP-010',
      total: 11400000.00,
      discount: 570000.00,
      pajak: 1191900.00,
      grand_total: 12021900.00,
      status: 'Posted'
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

  const totalAmount = pembelianData.reduce((sum, item) => sum + (item.grand_total || 0), 0);

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
                  Kode Divisi
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  No Penerimaan
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Tgl Penerimaan
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Supplier
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Nama Supplier
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Jatuh Tempo
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  No Faktur
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Total
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Discount
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Pajak
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Grand Total
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border border-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pembelianData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-3 py-8 text-center text-gray-500 border border-gray-300">
                    <div className="text-sm">
                      Drag a column header here to group by that column.
                    </div>
                  </td>
                </tr>
              ) : (
                pembelianData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs border border-gray-300 font-medium">
                      {item.kode_divisi}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.no_penerimaan}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.tgl_penerimaan}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.kode_supplier}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.nama_supplier}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.jatuh_tempo}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300">
                      {item.no_faktur}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                      {formatCurrency(item.discount)}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                      {formatCurrency(item.pajak)}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-right font-medium">
                      {formatCurrency(item.grand_total)}
                    </td>
                    <td className="px-3 py-2 text-xs border border-gray-300 text-center">
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer dengan Total */}
        <div className="p-3 bg-gray-100 border-t flex justify-end">
          <div className="text-sm font-medium text-gray-700">
            Total = {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PembelianReport;
