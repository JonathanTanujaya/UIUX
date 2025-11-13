import { useMemo } from 'react';

// Import all dummy data
import kategoriData from '../data/dummy/m_kategori.json';
import supplierData from '../data/dummy/m_supplier.json';
import customerData from '../data/dummy/m_cust.json';
import barangData from '../data/dummy/m_barang.json';
import areaData from '../data/dummy/m_area.json';
import salesData from '../data/dummy/m_sales.json';

export const useData = () => {
  const data = useMemo(() => ({
    // Master Data
    kategori: kategoriData,
    suppliers: supplierData,
    customers: customerData,
    barang: barangData,
  area: areaData,
  sales: salesData,
    
    // Helper Functions
    getKategoriById: (id) => kategoriData.find(k => k.id_kategori === id),
    getKategoriByKode: (kode) => kategoriData.find(k => k.kode_kategori === kode),
    getSupplierById: (id) => supplierData.find(s => s.id_supplier === id),
    getCustomerById: (id) => customerData.find(c => c.id_customer === id),
    getBarangById: (id) => barangData.find(b => b.id_barang === id),
    getBarangByKode: (kode) => barangData.find(b => b.kode_barang === kode),
  getAreaByKode: (kode) => areaData.find(a => a.kode_area === kode),
  getSalesByKode: (kode) => salesData.find(s => s.kode_sales === kode),
    
  }), []);

  return data;
};
