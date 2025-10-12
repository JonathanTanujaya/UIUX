# Master Data Module

Modul master data untuk sistem inventory management dengan 10 jenis master data.

## Daftar Master Data

1. **Kategori** - Master kategori barang
2. **Sparepart** - Master data sparepart/barang
3. **Stock Min** - Monitoring dan pengaturan stok minimum
4. **Checklist** - Master checklist untuk berbagai proses (Under Construction)
5. **Area** - Master area/wilayah distribusi
6. **Sales** - Master data sales person
7. **Supplier** - Master data supplier
8. **Customer** - Master data customer
9. **Bank** - Master data bank
10. **Rekening** - Master rekening perusahaan

## Fitur Umum

- **CRUD Operations**: Create, Read, Update, Delete untuk semua master data
- **Form Validation**: Validasi input untuk semua form
- **Search & Filter**: Pencarian dan filter data
- **Status Management**: Status aktif/tidak aktif
- **Responsive Design**: Tampilan optimal di desktop dan mobile

## Komponen yang Sudah Lengkap

### 1. Master Sparepart (`MasterSparepart.jsx`)

- Input kode dan nama sparepart
- Kategori dan merk barang
- Satuan, harga beli/jual
- Stok minimum
- CRUD operations lengkap

### 2. Master Stock Min (`MasterStockMin.jsx`)

- Monitoring stok vs stok minimum
- Perhitungan selisih otomatis
- Status indicator (Aman/Minimum/Kurang)
- Filter by kategori dan status
- Summary dashboard
- Real-time stok minimum adjustment

### 3. Master Area (`MasterArea.jsx`)

- Kode area dan nama area
- Wilayah dan provinsi
- Status management
- CRUD operations lengkap

### 4. Master Bank & Rekening (`MasterBank.jsx`)

- **UNIFIED PAGE**: Menggabungkan manajemen bank dan rekening dalam satu halaman
- **Two Tabs**: 
  - 📋 Daftar Rekening: CRUD rekening bank dengan detail bank
  - 💰 Monitoring Saldo: Visual monitoring saldo per rekening
- **Fields**:
  - No rekening (primary key)
  - Kode bank dan nama bank  
  - Atas nama rekening
  - Status rekening (aktif/non-aktif)
  - Saldo
- **Features**:
  - Form validation
  - Currency formatting
  - Status badges
  - Card-based saldo view
  - CRUD operations lengkap

## Routes

- `/master/kategori` - Master Kategori (existing)
- `/master/sparepart` - Master Sparepart
- `/master/stock-min` - Master Stock Minimum
- `/master/checklist` - Master Checklist
- `/master/area` - Master Area
- `/master/sales` - Master Sales (existing)
- `/master/supplier` - Master Supplier (existing)
- `/master/customer` - Master Customer (existing)
- `/master/bank` - Master Bank & Rekening (unified page)
- `/master/rekening` - Master Bank & Rekening (same as above)

## Navigation

Semua master data dapat diakses melalui sidebar menu "Master Data" dengan 10 submenu.

## Status Development

- ✅ **Complete**: Sparepart, Stock Min, Area, Bank, Rekening
- ✅ **Existing**: Kategori, Sales, Supplier, Customer
- 🚧 **Under Construction**: Checklist

## Database Fields

### Sparepart

- kode_sparepart, nama_sparepart, kategori, merk, satuan
- harga_beli, harga_jual, stok_min, keterangan

### Stock Min

- kode_barang, nama_barang, kategori
- stok_saat_ini, stok_minimum, selisih, status

### Area

- kode_area, nama_area, wilayah, provinsi
- keterangan, status

### Bank

- kode_bank, nama_bank, alamat, telepon, status

### Rekening

- no_rekening, nama_rekening, bank, jenis_rekening
- saldo_awal, status

## Sample Data

Setiap komponen memiliki sample data untuk demonstrasi yang mudah diganti dengan API call yang sesungguhnya.
