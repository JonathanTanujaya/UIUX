# Transactions Module

Modul transaksi untuk sistem inventory management dengan 11 jenis transaksi.

## Daftar Transaksi

1. **Pembelian** - Form pembelian barang dari supplier
2. **Retur Pembelian** - Form retur barang ke supplier
3. **Penjualan** - Form penjualan barang ke customer
4. **Merge Barang** - Gabungkan stok dari satu barang ke barang lain
5. **Retur Penjualan** - Form retur barang dari customer
6. **Invoice Cancel** - Batalkan invoice yang sudah dibuat
7. **Stok Opname** - Perhitungan dan penyesuaian stok fisik vs sistem
8. **Pembelian Bonus** - Transaksi pembelian dengan bonus (Under Construction)
9. **Penjualan Bonus** - Transaksi penjualan dengan bonus (Under Construction)
10. **Customer Claim** - Form pengajuan claim dari customer
11. **Pengembalian Claim** - Form pengembalian barang hasil claim (Under Construction)

## Fitur Umum

- **Form Validation**: Validasi input untuk semua form
- **Real-time Calculation**: Perhitungan otomatis untuk total, selisih, dll
- **Sample Data**: Menggunakan sample data untuk demonstrasi
- **Responsive Design**: Tampilan optimal di desktop dan mobile
- **Loading States**: Loading indicator saat proses saving

## Komponen yang Sudah Lengkap

### 1. Merge Barang (`MergeBarangForm.jsx`)

- Pilih barang asal dan tujuan
- Input qty yang akan di-merge
- Validasi stok barang
- Real-time info stok

### 2. Invoice Cancel (`InvoiceCancelForm.jsx`)

- Pilih invoice yang akan dibatalkan
- Preview detail invoice
- Pilih alasan pembatalan
- Konfirmasi pembatalan dengan warning

### 3. Stok Opname (`StokOpnameForm.jsx`)

- Input stok fisik vs stok sistem
- Perhitungan selisih otomatis
- Summary total selisih
- Status indikator (Lebih/Kurang/Sesuai)

### 4. Customer Claim (`CustomerClaimForm.jsx`)

- Pilih customer dan invoice
- Multiple item claim
- Perhitungan total claim
- Jenis claim dan alasan

## Routes

- `/transactions/pembelian` - Form Pembelian
- `/transactions/retur-pembelian` - Retur Pembelian
- `/transactions/penjualan` - Form Penjualan
- `/transactions/merge-barang` - Merge Barang
- `/transactions/retur-penjualan` - Retur Penjualan
- `/transactions/invoice-cancel` - Invoice Cancel
- `/transactions/stok-opname` - Stok Opname
- `/transactions/pembelian-bonus` - Pembelian Bonus
- `/transactions/penjualan-bonus` - Penjualan Bonus
- `/transactions/customer-claim` - Customer Claim

## Navigation

Semua transaksi dapat diakses melalui sidebar menu "Transaksi" dengan 10 submenu.

## Status Development

- ✅ **Complete**: Merge Barang, Invoice Cancel, Stok Opname, Customer Claim
- ✅ **Existing**: Pembelian, Retur Pembelian, Penjualan, Retur Penjualan
- 🚧 **Under Construction**: Pembelian Bonus, Penjualan Bonus, Pengembalian Claim
