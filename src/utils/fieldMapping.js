/**
 * Database Field Mapping - Standardisasi nama field yang inconsistent
 * antara database dan frontend untuk semua MasterData modules
 */

// Mapping untuk Customer fields
export const customerFieldMap = {
  // Standard field -> Possible database variants
  id: ['id', 'ID', 'customer_id', 'custid'],
  kode: ['kodeCustomer', 'kodecust', 'kode_customer', 'customer_code', 'code'],
  nama: ['namacust', 'nama', 'nama_customer', 'customer_name', 'name'],
  alamat: ['alamat', 'address', 'alamat_customer'],
  telepon: ['telepon', 'phone', 'no_telepon', 'telp', 'hp'],
  email: ['email', 'email_customer', 'e_mail'],
  status: ['status', 'active', 'is_active', 'customer_status'],
};

// Mapping untuk Barang fields
export const barangFieldMap = {
  id: ['id', 'ID', 'barang_id', 'itemid'],
  kode_barang: ['kode_barang', 'kodebarang', 'item_code', 'code', 'sku'],
  nama_barang: ['nama_barang', 'namabarang', 'item_name', 'name', 'nama'],
  kategori: ['kategori', 'category', 'category_name', 'nama_kategori'],
  kodedivisi: ['kodedivisi', 'kode_divisi', 'division_code', 'divisi'],
  modal: ['modal', 'harga_modal', 'cost_price', 'modal_price'],
  harga_jual: ['harga_jual', 'hargajual', 'selling_price', 'harga'],
  stok: ['stok', 'stock', 'qty', 'quantity', 'jumlah'],
  stok_min: ['stok_min', 'stokmin', 'minimum_stock', 'min_stock', 'stock_minimum'],
  satuan: ['satuan', 'unit', 'uom', 'unit_measure'],
  tanggal_masuk: ['tanggal_masuk', 'tglmasuk', 'created_at', 'entry_date'],
};

// Mapping untuk Sparepart fields
export const sparepartFieldMap = {
  id: ['id', 'ID', 'sparepart_id'],
  kode_sparepart: ['kode_sparepart', 'kodesparepart', 'part_code', 'code'],
  nama_sparepart: ['nama_sparepart', 'namasparepart', 'part_name', 'nama'],
  jenis: ['jenis', 'type', 'sparepart_type', 'kategori'],
  harga: ['harga', 'price', 'harga_sparepart', 'cost'],
  stok: ['stok', 'stock', 'qty', 'quantity'],
  supplier: ['supplier', 'supplier_name', 'nama_supplier'],
};

// Mapping untuk Bank fields
export const bankFieldMap = {
  id: ['id', 'ID', 'bank_id'],
  kode_bank: ['kode_bank', 'kodebank', 'bank_code', 'code'],
  nama_bank: ['nama_bank', 'namabank', 'bank_name', 'nama'],
  no_rekening: ['no_rekening', 'norekening', 'account_number', 'rekening'],
  atas_nama: ['atas_nama', 'atasnama', 'account_name', 'nama_rekening'],
  saldo: ['saldo', 'balance', 'current_balance'],
};

/**
 * Universal field mapper - mencari nilai field dari berbagai kemungkinan nama
 */
export const mapField = (data, fieldMap, targetField, defaultValue = null) => {
  if (!data || typeof data !== 'object') return defaultValue;

  const possibleFields = fieldMap[targetField];
  if (!possibleFields || !Array.isArray(possibleFields)) return defaultValue;

  // Cari field yang ada di data
  for (const field of possibleFields) {
    if (data.hasOwnProperty(field) && data[field] !== null && data[field] !== undefined) {
      return data[field];
    }
  }

  return defaultValue;
};

/**
 * Standardize Customer object
 */
export const standardizeCustomer = customer => {
  if (!customer) return null;

  return {
    id: mapField(customer, customerFieldMap, 'id'),
    kode: mapField(customer, customerFieldMap, 'kode', ''),
    nama: mapField(customer, customerFieldMap, 'nama', ''),
    alamat: mapField(customer, customerFieldMap, 'alamat', ''),
    telepon: mapField(customer, customerFieldMap, 'telepon', ''),
    email: mapField(customer, customerFieldMap, 'email', ''),
    status: mapField(customer, customerFieldMap, 'status', 'aktif'),
  };
};

/**
 * Standardize Barang object
 */
export const standardizeBarang = barang => {
  if (!barang) return null;

  return {
    id: mapField(barang, barangFieldMap, 'id'),
    kode_barang: mapField(barang, barangFieldMap, 'kode_barang', ''),
    nama_barang: mapField(barang, barangFieldMap, 'nama_barang', ''),
    kategori: mapField(barang, barangFieldMap, 'kategori', ''),
    kodedivisi: mapField(barang, barangFieldMap, 'kodedivisi', ''),
    modal: mapField(barang, barangFieldMap, 'modal', 0),
    harga_jual: mapField(barang, barangFieldMap, 'harga_jual', 0),
    stok: mapField(barang, barangFieldMap, 'stok', 0),
    stok_min: mapField(barang, barangFieldMap, 'stok_min', 0),
    satuan: mapField(barang, barangFieldMap, 'satuan', 'PCS'),
    tanggal_masuk: mapField(barang, barangFieldMap, 'tanggal_masuk', ''),
  };
};

/**
 * Standardize Sparepart object
 */
export const standardizeSparepart = sparepart => {
  if (!sparepart) return null;

  return {
    id: mapField(sparepart, sparepartFieldMap, 'id'),
    kode_sparepart: mapField(sparepart, sparepartFieldMap, 'kode_sparepart', ''),
    nama_sparepart: mapField(sparepart, sparepartFieldMap, 'nama_sparepart', ''),
    jenis: mapField(sparepart, sparepartFieldMap, 'jenis', ''),
    harga: mapField(sparepart, sparepartFieldMap, 'harga', 0),
    stok: mapField(sparepart, sparepartFieldMap, 'stok', 0),
    supplier: mapField(sparepart, sparepartFieldMap, 'supplier', ''),
  };
};

/**
 * Standardize Bank object
 */
export const standardizeBank = bank => {
  if (!bank) return null;

  return {
    id: mapField(bank, bankFieldMap, 'id'),
    kode_bank: mapField(bank, bankFieldMap, 'kode_bank', ''),
    nama_bank: mapField(bank, bankFieldMap, 'nama_bank', ''),
    no_rekening: mapField(bank, bankFieldMap, 'no_rekening', ''),
    atas_nama: mapField(bank, bankFieldMap, 'atas_nama', ''),
    saldo: mapField(bank, bankFieldMap, 'saldo', 0),
  };
};

/**
 * Auto-detect dan standardize berdasarkan tipe data
 */
export const autoStandardize = (data, dataType) => {
  if (!data) return null;

  switch (dataType.toLowerCase()) {
    case 'customer':
    case 'customers':
      return standardizeCustomer(data);
    case 'barang':
    case 'item':
    case 'items':
      return standardizeBarang(data);
    case 'sparepart':
    case 'parts':
      return standardizeSparepart(data);
    case 'bank':
    case 'banks':
      return standardizeBank(data);
    default:
      return data; // Return original jika tidak dikenali
  }
};

export default {
  customerFieldMap,
  barangFieldMap,
  sparepartFieldMap,
  bankFieldMap,
  mapField,
  standardizeCustomer,
  standardizeBarang,
  standardizeSparepart,
  standardizeBank,
  autoStandardize,
};
