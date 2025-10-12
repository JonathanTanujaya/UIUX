/*
  Global network stub: disables all real API calls in the frontend.
  - Overrides axios adapter so ALL axios instances (created after this import) return stubbed responses.
  - Overrides window.fetch to return a stubbed Response.
  Import this file once at app bootstrap before any services create axios instances.
*/

import axios from 'axios';

// Build a minimal AxiosResponse-like object
function buildAxiosResponse(config, data) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: undefined,
  };
}

// Realistic dummy data generators
function generateDummyData(url) {
  const path = typeof url === 'string' ? url.toLowerCase() : '';
  
  // Customers
  if (path.includes('customer')) {
    return Array.from({ length: 25 }, (_, i) => ({
      kode_divisi: '01',
      kode_cust: `CUST${String(i + 1).padStart(4, '0')}`,
      nama_customer: `${['PT', 'CV', 'UD', 'Toko'][i % 4]} ${['Maju', 'Jaya', 'Sejahtera', 'Makmur', 'Sukses'][i % 5]} ${['Group', 'Indonesia', 'Mandiri', 'Utama', 'Prima'][i % 5]}`,
      alamat_customer: `Jl. ${['Sudirman', 'Thamrin', 'Gatot Subroto', 'Kuningan', 'Senopati'][i % 5]} No. ${i + 10}`,
      kota: ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang'][i % 5],
      telp: `021-${Math.floor(Math.random() * 90000000 + 10000000)}`,
      npwp: `${Math.floor(Math.random() * 900000000000000 + 100000000000000)}`,
      kode_sales: `SLS${String((i % 5) + 1).padStart(3, '0')}`,
      kode_area: `AREA${String((i % 3) + 1).padStart(2, '0')}`,
      top: [0, 14, 30, 45, 60][i % 5],
      limit_piutang: (i + 1) * 10000000,
      saldo_piutang: (i + 1) * 2500000,
    }));
  }
  
  // Suppliers
  if (path.includes('supplier')) {
    return Array.from({ length: 20 }, (_, i) => ({
      kode_divisi: '01',
      kode_supplier: `SUP${String(i + 1).padStart(4, '0')}`,
      nama_supplier: `${['PT', 'CV', 'UD'][i % 3]} Supplier ${['Utama', 'Sentosa', 'Jaya', 'Mandiri', 'Global'][i % 5]}`,
      alamat: `Jl. ${['Raya', 'Industri', 'Boulevard', 'Arteri'][i % 4]} No. ${i + 100}`,
      kota: ['Jakarta', 'Tangerang', 'Bekasi', 'Bogor'][i % 4],
      telp: `021-${Math.floor(Math.random() * 90000000 + 10000000)}`,
      npwp: `${Math.floor(Math.random() * 900000000000000 + 100000000000000)}`,
      top: [0, 14, 30, 45][i % 4],
    }));
  }
  
  // Sales
  if (path.includes('sales') && !path.includes('return')) {
    return Array.from({ length: 15 }, (_, i) => ({
      kode_divisi: '01',
      kode_sales: `SLS${String(i + 1).padStart(3, '0')}`,
      nama_sales: ['Ahmad', 'Budi', 'Cindy', 'Dedi', 'Eko', 'Fina', 'Gita', 'Hendra', 'Irma', 'Joko'][i % 10] + ' ' + ['Santoso', 'Wijaya', 'Pratama', 'Kurniawan'][i % 4],
      alamat: `Jl. ${['Merdeka', 'Sudirman', 'Ahmad Yani'][i % 3]} No. ${i + 5}`,
      kota: ['Jakarta', 'Bandung', 'Surabaya'][i % 3],
      telp: `08${Math.floor(Math.random() * 900000000 + 100000000)}`,
      komisi_persen: [2.5, 3, 3.5, 4, 5][i % 5],
      target_bulanan: (i + 1) * 50000000,
    }));
  }
  
  // Barang/Products
  if (path.includes('barang')) {
    return Array.from({ length: 50 }, (_, i) => ({
      kode_divisi: '01',
      kode_barang: `BRG${String(i + 1).padStart(5, '0')}`,
      nama_barang: `${['Komponen', 'Sparepart', 'Aksesoris', 'Part'][i % 4]} ${['A', 'B', 'C', 'D', 'E'][i % 5]}-${String(i + 100).padStart(3, '0')}`,
      kode_kategori: `KAT${String((i % 10) + 1).padStart(3, '0')}`,
      satuan: ['PCS', 'SET', 'BOX', 'MTR', 'KG'][i % 5],
      harga_beli: (i + 1) * 25000,
      harga_jual: (i + 1) * 35000,
      stok: Math.floor(Math.random() * 500),
      stok_min: 10 + (i % 20),
      aktif: true,
    }));
  }
  
  // Categories
  if (path.includes('kategori') || path.includes('categories')) {
    return Array.from({ length: 15 }, (_, i) => ({
      kode_divisi: '01',
      kode_kategori: `KAT${String(i + 1).padStart(3, '0')}`,
      nama_kategori: ['Elektronik', 'Mekanik', 'Hydraulic', 'Pneumatic', 'Bearing', 'Seal', 'Oil Filter', 'Air Filter', 'Belt', 'Chain', 'Gasket', 'Sensor', 'Switch', 'Relay', 'Connector'][i % 15],
      deskripsi: `Kategori produk ${i + 1}`,
    }));
  }
  
  // Areas
  if (path.includes('area')) {
    return Array.from({ length: 10 }, (_, i) => ({
      kode_divisi: '01',
      kode_area: `AREA${String(i + 1).padStart(2, '0')}`,
      nama_area: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Timur', 'Tangerang', 'Bekasi', 'Bogor', 'Depok', 'Bandung'][i % 10],
    }));
  }
  
  // Invoices
  if (path.includes('invoice')) {
    return Array.from({ length: 30 }, (_, i) => ({
      kode_divisi: '01',
      no_invoice: `INV/${String(2024).slice(-2)}/${String(i + 1).padStart(5, '0')}`,
      tgl_invoice: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      kode_cust: `CUST${String((i % 25) + 1).padStart(4, '0')}`,
      nama_customer: `Customer ${(i % 25) + 1}`,
      total: (i + 1) * 2500000,
      pajak: (i + 1) * 275000,
      grand_total: (i + 1) * 2775000,
      status: ['Open', 'Partial', 'Paid', 'Overdue'][i % 4],
      jatuh_tempo: new Date(2024, 1, i + 15).toISOString().split('T')[0],
    }));
  }
  
  // Banks
  if (path.includes('bank')) {
    return Array.from({ length: 8 }, (_, i) => ({
      kode_divisi: '01',
      kode_bank: `BNK${String(i + 1).padStart(2, '0')}`,
      nama_bank: ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Permata', 'Danamon', 'OCBC NISP'][i % 8],
      no_rekening: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      atas_nama: 'PT Stoir Indonesia',
      saldo: (i + 1) * 50000000,
    }));
  }
  
  // Default empty
  return [];
}

// Decide stub payload based on method
function stubPayloadFor(method, config) {
  const m = (method || 'get').toLowerCase();
  const url = config?.url || '';
  
  if (m === 'get' || m === 'head' || m === 'options') {
    const dummyData = generateDummyData(url);
    return { 
      data: dummyData, 
      totalCount: dummyData.length, 
      success: true, 
      message: 'Stubbed with dummy data' 
    };
  }
  
  // For mutating methods, return success with generated item
  const singleItem = generateDummyData(url)[0] || null;
  return { 
    success: true, 
    message: 'Operation successful (stubbed)', 
    data: singleItem 
  };
}

// Install a global axios adapter stub BEFORE any axios.create() usage elsewhere
axios.defaults.adapter = async (config) => {
  const payload = stubPayloadFor(config.method, config);
  
  // Respect binary response types to prevent consumer errors
  let finalPayload = payload;
  if (config.responseType === 'blob') {
    finalPayload = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  } else if (config.responseType === 'arraybuffer') {
    finalPayload = new TextEncoder().encode(JSON.stringify(payload)).buffer;
  }

  if (import.meta?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn('[STUB] Axios request blocked:', config.method?.toUpperCase(), config.url);
  }
  return buildAxiosResponse(config, finalPayload);
};

// Safe fetch stub
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch?.bind(window);

  window.fetch = async (input, init = {}) => {
    const method = (init.method || 'GET').toLowerCase();
    const url = typeof input === 'string' ? input : (input?.url || '');
    const payload = stubPayloadFor(method, { url });

    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[STUB] fetch request blocked:', method.toUpperCase(), url);
    }

    // Minimal Response-like object
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      url,
      redirected: false,
      type: 'basic',
      clone() { return this; },
      async json() { return payload; },
      async text() { return JSON.stringify(payload); },
      async blob() { return new Blob([JSON.stringify(payload)], { type: 'application/json' }); },
      async arrayBuffer() { return new TextEncoder().encode(JSON.stringify(payload)).buffer; },
      bodyUsed: false,
    };
  };

  // Keep a reference in case you need to restore later (not used now)
  window.__ORIGINAL_FETCH__ = originalFetch;
}

// Export noop to avoid tree-shaking removal when imported
export default null;
