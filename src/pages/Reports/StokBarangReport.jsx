import React, { useState } from 'react';

const StokBarangReport = () => {
  // Sample data berdasarkan referensi gambar
  const [stockData] = useState([
    {
      kode_barang: 'R12K4H',
      nama_barang: 'RELAY 12V KAKI 4 HELLA',
      kode_kategori: 'RL',
      harga_list: 23000.00,
      harga_jual: 23000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 0,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB12H',
      nama_barang: 'WIPER BLADE 12" HELLA',
      kode_kategori: 'WP',
      harga_list: 36000.00,
      harga_jual: 36000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 0,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB14H',
      nama_barang: 'WIPER BLADE 14" HELLA',
      kode_kategori: 'WP',
      harga_list: 36000.00,
      harga_jual: 36000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 14,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB16H',
      nama_barang: 'WIPER BLADE 16" HELLA',
      kode_kategori: 'WP',
      harga_list: 38000.00,
      harga_jual: 38000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 0,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB17H',
      nama_barang: 'WIPER BLADE 17" HELLA',
      kode_kategori: 'WP',
      harga_list: 38000.00,
      harga_jual: 38000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 100,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB18H',
      nama_barang: 'WIPER BLADE 18" HELLA',
      kode_kategori: 'WP',
      harga_list: 38000.00,
      harga_jual: 38000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 3,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB19H',
      nama_barang: 'WIPER BLADE 19" HELLA',
      kode_kategori: 'WP',
      harga_list: 41000.00,
      harga_jual: 41000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 10,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB20H',
      nama_barang: 'WIPER BLADE 20" HELLA',
      kode_kategori: 'WP',
      harga_list: 41000.00,
      harga_jual: 41000.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 0,
      stok_claim: 0,
      saldo: 0
    },
    {
      kode_barang: 'WB21H',
      nama_barang: 'WIPER BLADE 21" HELLA',
      kode_kategori: 'WP',
      harga_list: 48500.00,
      harga_jual: 48500.00,
      harga_list2: 0.00,
      harga_jual2: 0.00,
      lokasi: '-',
      stok: 30,
      stok_claim: 0,
      saldo: 0
    }
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Barang
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Nama Barang
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Kode Kategori
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Harga List
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Harga Jual
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Harga List2
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Harga Jual2
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border border-gray-300">
                  Lokasi
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Stok
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Stok Claim
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, index) => (
                <tr key={item.kode_barang} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs border border-gray-300 font-medium">
                    {item.kode_barang}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300">
                    {item.nama_barang}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-center">
                    {item.kode_kategori}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {formatCurrency(item.harga_list)}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {formatCurrency(item.harga_jual)}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {formatCurrency(item.harga_list2)}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {formatCurrency(item.harga_jual2)}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-center">
                    {item.lokasi}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right font-medium">
                    {item.stok}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {item.stok_claim}
                  </td>
                  <td className="px-3 py-2 text-xs border border-gray-300 text-right">
                    {item.saldo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer dengan tombol */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Refresh
          </button>
          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default StokBarangReport;
