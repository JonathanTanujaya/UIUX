import { useMemo } from 'react';

// Import all dummy data
import kategoriData from '../data/dummy/kategori.json';
import supplierData from '../data/dummy/supplier.json';
import customerData from '../data/dummy/customer.json';
import barangData from '../data/dummy/barang.json';

export const useData = () => {
  const data = useMemo(() => ({
    // Master Data
    kategori: kategoriData,
    suppliers: supplierData,
    customers: customerData,
    barang: barangData,
    
    // Helper Functions
    getKategoriById: (id) => kategoriData.find(k => k.id_kategori === id),
    getKategoriByKode: (kode) => kategoriData.find(k => k.kode_kategori === kode),
    getSupplierById: (id) => supplierData.find(s => s.id_supplier === id),
    getCustomerById: (id) => customerData.find(c => c.id_customer === id),
    getBarangById: (id) => barangData.find(b => b.id_barang === id),
    getBarangByKode: (kode) => barangData.find(b => b.kode_barang === kode),
    
  }), []);

  return data;
};
