# Reports Module

Modul laporan untuk sistem inventory management dengan 13 jenis laporan berbeda.

## Daftar Laporan

1. **Stok Barang** - Laporan ketersediaan stok barang
2. **Kartu Stok** - Mutasi stok per barang
3. **Pembelian** - Laporan pembelian dari supplier
4. **Pembelian Item** - Detail item pembelian
5. **Penjualan** - Laporan penjualan ke customer
6. **COGS** - Cost of Goods Sold analysis
7. **Return Sales** - Laporan retur penjualan
8. **Tampil Invoice** - Preview dan print invoice
9. **Saldo Rekening** - Saldo akun keuangan
10. **Pembayaran Customer** - Laporan pembayaran dari customer
11. **Tagihan** - Daftar tagihan outstanding
12. **Pemotongan Return Customer** - Pemotongan tagihan dengan retur
13. **Komisi Sales** - Laporan komisi sales person

## Fitur Umum

- **Filter & Search**: Setiap laporan memiliki filter berdasarkan periode, kategori, dll
- **Export Excel**: Fungsi export ke Excel (akan diimplementasi dengan API)
- **Print**: Fungsi print dengan styling khusus
- **Responsive Design**: Tampilan optimal di desktop dan mobile
- **Sample Data**: Menggunakan sample data untuk demonstrasi

## Teknologi

- React + React Hooks
- CSS Custom Properties
- Responsive Grid System
- Print-friendly styling

## Usage

```jsx
import { StokBarangReport } from './pages/Reports';

// Atau import individual
import StokBarangReport from './pages/Reports/StokBarangReport';
```

## Navigation

Semua laporan dapat diakses melalui sidebar menu "Laporan" dengan 13 submenu.

Routes:

- `/reports/stok-barang`
- `/reports/kartu-stok`
- `/reports/pembelian`
- `/reports/pembelian-item`
- `/reports/penjualan`
- `/reports/cogs`
- `/reports/return-sales`
- `/reports/tampil-invoice`
- `/reports/saldo-rekening`
- `/reports/pembayaran-customer`
- `/reports/tagihan`
- `/reports/pemotongan-return-customer`
- `/reports/komisi-sales`
