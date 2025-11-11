-- =================================================================
-- POSTGRESQL VIEWS UNTUK SISTEM SINGLE-TENANT 
-- =================================================================
-- File: uptView_fixed.sql (Fixed for Single-Tenant Architecture)
-- Date: 2025-09-18
-- 
-- Deskripsi: 
-- File ini berisi definisi VIEW yang telah diperbaiki untuk arsitektur
-- single-tenant (menghapus kode_divisi dan referensi tabel yang dihapus)
-- =================================================================

-- 1. VIEW v_bank (FIXED - Using rekening_bank table)
-- Deskripsi: Menampilkan daftar rekening bank dari tabel rekening_bank
CREATE OR REPLACE VIEW v_bank AS
SELECT 
    rb.no_rekening, 
    rb.kode_bank, 
    rb.nama_bank, 
    rb.atas_nama, 
    rb.status_rekening AS status,
    rb.saldo,
    rb.created_at,
    rb.updated_at
FROM rekening_bank rb;

-- 2. VIEW v_barang (FIXED - Removed kode_divisi)
-- Deskripsi: Menampilkan master barang dengan detail stok dan harga
CREATE OR REPLACE VIEW v_barang AS
SELECT 
    mb.kode_barang, 
    mb.nama_barang, 
    mb.kode_kategori, 
    mb.harga_list, 
    mb.harga_jual, 
    db.tgl_masuk,
    db.modal, 
    db.stok, 
    mb.satuan, 
    mb.merk, 
    mb.disc1, 
    mb.disc2, 
    mb.barcode, 
    mb.status, 
    db.id,
    mb.lokasi,
    mb.stok_min
FROM m_barang mb
LEFT JOIN d_barang db ON mb.kode_barang = db.kode_barang;

-- 3. VIEW v_customer_resi (FIXED - Using penerimaan_finance)
-- Deskripsi: Menggunakan penerimaan_finance sebagai pengganti m_resi
CREATE OR REPLACE VIEW v_customer_resi AS
SELECT 
    pf.no_penerimaan AS no_resi, 
    pf.no_rek_tujuan AS no_rekening_tujuan, 
    pf.tgl_penerimaan AS tgl_pembayaran, 
    pf.kode_cust, 
    mc.nama_cust, 
    pf.jumlah, 
    (pf.jumlah - COALESCE((SELECT SUM(pfd.jumlah_bayar) FROM penerimaan_finance_detail pfd WHERE pfd.no_penerimaan = pf.no_penerimaan), 0)) AS sisa_resi, 
    pf.keterangan,
    pf.status, 
    rb.kode_bank, 
    rb.nama_bank
FROM penerimaan_finance pf
LEFT JOIN rekening_bank rb ON pf.no_rek_tujuan = rb.no_rekening
LEFT JOIN m_cust mc ON pf.kode_cust = mc.kode_cust
WHERE pf.tipe = 'Resi';

-- 4. VIEW v_cust_retur (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_cust_retur AS
SELECT 
    rs.no_retur, 
    rs.tgl_retur, 
    rs.kode_cust, 
    mc.nama_cust, 
    rs.total, 
    rs.sisa_retur, 
    rs.keterangan,
    rs.status
FROM return_sales rs
LEFT JOIN m_cust mc ON rs.kode_cust = mc.kode_cust;

-- 5. VIEW v_invoice (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_invoice AS
SELECT 
    i.no_invoice, 
    i.tgl_faktur, 
    i.kode_cust, 
    mc.nama_cust, 
    i.kode_sales, 
    ms.nama_sales, 
    mc.kode_area, 
    ma.area,
    i.tipe, 
    i.jatuh_tempo, 
    i.grand_total, 
    i.sisa_invoice, 
    i.ket, 
    i.status, 
    id.kode_barang, 
    mb.nama_barang, 
    mb.kode_kategori,
    mk.kategori, 
    id.qty_supply, 
    id.harga_jual, 
    id.jenis, 
    id.diskon1, 
    id.diskon2, 
    id.harga_nett,
    id.status AS status_detail, 
    id.id, 
    mb.merk, 
    mc.alamat AS alamat_cust, 
    i.total, 
    i.disc, 
    i.pajak, 
    mc.telp AS telp_cust, 
    mc.no_npwp AS npwp_cust, 
    mb.satuan, 
    i.username,
    i.tt
FROM invoice i
JOIN invoice_detail id ON i.no_invoice = id.no_invoice
JOIN m_barang mb ON id.kode_barang = mb.kode_barang
LEFT JOIN m_kategori mk ON mb.kode_kategori = mk.kode_kategori
LEFT JOIN m_cust mc ON i.kode_cust = mc.kode_cust
LEFT JOIN m_area ma ON mc.kode_area = ma.kode_area
LEFT JOIN m_sales ms ON i.kode_sales = ms.kode_sales;

-- 6. VIEW v_invoice_header (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_invoice_header AS
SELECT 
    i.no_invoice, 
    i.tgl_faktur, 
    i.kode_cust, 
    mc.nama_cust, 
    mc.kode_area, 
    ma.area, 
    i.kode_sales, 
    ms.nama_sales, 
    i.tipe,
    i.jatuh_tempo, 
    i.grand_total, 
    i.sisa_invoice, 
    i.ket, 
    i.status, 
    i.total, 
    i.disc, 
    i.pajak,
    mc.no_npwp, 
    mc.nama_pajak, 
    mc.alamat_pajak, 
    i.tt
FROM invoice i
LEFT JOIN m_sales ms ON i.kode_sales = ms.kode_sales
LEFT JOIN m_cust mc ON i.kode_cust = mc.kode_cust
LEFT JOIN m_area ma ON mc.kode_area = ma.kode_area;

-- 7. VIEW v_journal (NO CHANGE - Already compatible)
CREATE OR REPLACE VIEW v_journal AS
SELECT 
    j.id, 
    j.tanggal,
    j.transaksi,
    j.kode_coa,
    mc.nama_coa,
    mc.saldo_normal,
    j.keterangan,
    j.debet,
    j.credit,
    j.created_at
FROM journal j
INNER JOIN m_coa mc ON j.kode_coa = mc.kode_coa;

-- 8. VIEW v_kartu_stok (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_kartu_stok AS
SELECT 
    ks.urut, 
    ks.kode_barang,
    mb.nama_barang,
    ks.no_ref,
    ks.tgl_proses,
    ks.tipe,
    ks.increase,
    ks.decrease,
    ks.harga_debet,
    ks.harga_kredit,
    ks.hpp,
    ks.qty
FROM kartu_stok ks
INNER JOIN m_barang mb ON ks.kode_barang = mb.kode_barang;

-- 9. VIEW v_part_penerimaan (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_part_penerimaan AS
SELECT 
    pp.no_penerimaan, 
    pp.tgl_penerimaan,
    pp.kode_supplier,
    ms.nama_supplier,
    pp.no_faktur,
    pp.total,
    pp.disc,
    pp.pajak,
    pp.grand_total,
    pp.sisa_penerimaan,
    pp.status,
    ppd.kode_barang,
    mb.nama_barang,
    ppd.qty_supply,
    ppd.harga,
    ppd.diskon1,
    ppd.diskon2,
    ppd.harga_nett
FROM part_penerimaan pp
JOIN part_penerimaan_detail ppd ON pp.no_penerimaan = ppd.no_penerimaan
LEFT JOIN m_supplier ms ON pp.kode_supplier = ms.kode_supplier
LEFT JOIN m_barang mb ON ppd.kode_barang = mb.kode_barang;

-- 10. VIEW v_part_penerimaan_header (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_part_penerimaan_header AS
SELECT 
    pp.no_penerimaan, 
    pp.tgl_penerimaan,
    pp.kode_supplier,
    ms.nama_supplier,
    pp.kode_valas,
    pp.kurs,
    pp.jatuh_tempo,
    pp.no_faktur,
    pp.total,
    pp.disc,
    pp.pajak,
    pp.grand_total,
    pp.sisa_penerimaan,
    pp.status
FROM part_penerimaan pp
INNER JOIN m_supplier ms ON pp.kode_supplier = ms.kode_supplier;

-- 11. VIEW v_penerimaan_finance (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_penerimaan_finance AS
SELECT 
    pf.no_penerimaan, 
    pf.tgl_penerimaan,
    pf.tipe,
    pf.no_rek_tujuan,
    pf.kode_cust,
    mc.nama_cust,
    pf.jumlah,
    pf.keterangan,
    pf.status,
    pf.no_voucher
FROM penerimaan_finance pf
LEFT JOIN m_cust mc ON pf.kode_cust = mc.kode_cust;

-- 12. VIEW v_penerimaan_finance_detail (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_penerimaan_finance_detail AS
SELECT 
    pf.no_penerimaan, 
    pf.tgl_penerimaan,
    pf.kode_cust,
    mc.nama_cust,
    pfd.no_invoice,
    i.tgl_faktur,
    i.kode_sales,
    ms.nama_sales,
    pfd.jumlah_invoice,
    pfd.sisa_invoice,
    pfd.jumlah_bayar,
    pfd.jumlah_dispensasi,
    pfd.status,
    pf.no_voucher
FROM penerimaan_finance pf
JOIN penerimaan_finance_detail pfd ON pf.no_penerimaan = pfd.no_penerimaan
LEFT JOIN m_cust mc ON pf.kode_cust = mc.kode_cust
LEFT JOIN invoice i ON pfd.no_invoice = i.no_invoice
LEFT JOIN m_sales ms ON i.kode_sales = ms.kode_sales;

-- 13. VIEW v_return_sales_detail (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_return_sales_detail AS
SELECT 
    rs.no_retur, 
    rs.tgl_retur,
    rs.kode_cust,
    mc.nama_cust,
    rs.total,
    rs.sisa_retur,
    rs.status,
    rsd.no_invoice,
    i.tgl_faktur,
    i.kode_sales,
    ms.nama_sales,
    rsd.kode_barang,
    mb.nama_barang,
    rsd.qty_retur,
    rsd.harga_nett,
    rsd.status AS status_detail,
    rs.tt
FROM return_sales rs
JOIN return_sales_detail rsd ON rs.no_retur = rsd.no_retur
LEFT JOIN m_cust mc ON rs.kode_cust = mc.kode_cust
LEFT JOIN invoice i ON rsd.no_invoice = i.no_invoice
LEFT JOIN m_sales ms ON i.kode_sales = ms.kode_sales
LEFT JOIN m_barang mb ON rsd.kode_barang = mb.kode_barang;

-- 14. VIEW v_trans (FIXED - Corrected column names)
CREATE OR REPLACE VIEW v_trans AS
SELECT 
    dt.kode_trans,
    mt.transaksi,
    dt.kode_coa,
    mc.nama_coa,
    dt.saldo_normal
FROM d_trans dt
INNER JOIN m_trans mt ON dt.kode_trans = mt.kode_trans
INNER JOIN m_coa mc ON dt.kode_coa = mc.kode_coa;

-- 15. VIEW v_tt (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_tt AS
SELECT 
    mt.no_tt, 
    mt.tgl_tt,
    mt.kode_cust,
    mc.nama_cust,
    mt.jumlah,
    mt.keterangan,
    mt.status
FROM m_tt mt
LEFT JOIN m_cust mc ON mt.kode_cust = mc.kode_cust;

-- 16. VIEW v_tt_invoice (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_tt_invoice AS
SELECT 
    mt.no_tt, 
    mt.tgl_tt,
    mt.kode_cust,
    mc.nama_cust,
    dt.no_ref AS no_invoice,
    i.tgl_faktur,
    i.kode_sales,
    ms.nama_sales,
    i.grand_total,
    i.sisa_invoice,
    i.status,
    dt.jumlah AS jumlah_tt
FROM m_tt mt
JOIN d_tt dt ON mt.no_tt = dt.no_tt
JOIN m_cust mc ON mt.kode_cust = mc.kode_cust
JOIN invoice i ON dt.no_ref = i.no_invoice
JOIN m_sales ms ON i.kode_sales = ms.kode_sales;

-- 17. VIEW v_tt_retur (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_tt_retur AS
SELECT 
    mt.no_tt, 
    mt.tgl_tt,
    mt.kode_cust,
    mc.nama_cust,
    dt.no_ref AS no_retur,
    rs.tgl_retur,
    rs.total,
    rs.sisa_retur,
    rs.status,
    rsd.kode_barang,
    mb.nama_barang,
    rsd.qty_retur,
    rsd.harga_nett,
    dt.jumlah AS jumlah_tt
FROM m_tt mt
JOIN m_cust mc ON mt.kode_cust = mc.kode_cust
JOIN d_tt dt ON mt.no_tt = dt.no_tt
JOIN return_sales rs ON dt.no_ref = rs.no_retur
JOIN return_sales_detail rsd ON rs.no_retur = rsd.no_retur
JOIN m_barang mb ON rsd.kode_barang = mb.kode_barang;

-- 18. VIEW v_voucher (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_voucher AS
SELECT 
    mv.no_voucher, 
    mv.tgl_voucher,
    mv.kode_sales,
    ms.nama_sales,
    mv.jenis_transaksi,
    mv.persen_komisi,
    mv.jumlah_komisi,
    mv.status
FROM m_voucher mv
INNER JOIN m_sales ms ON mv.kode_sales = ms.kode_sales;

-- 19. VIEW v_stok_summary (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_stok_summary AS
SELECT 
    mb.kode_barang,
    mb.nama_barang,
    mb.satuan,
    mb.stok_min,
    mb.lokasi,
    COALESCE(SUM(db.stok), 0) AS total_stok,
    CASE 
        WHEN COALESCE(SUM(db.stok), 0) <= 0 THEN 'Habis'
        WHEN COALESCE(SUM(db.stok), 0) <= mb.stok_min THEN 'Minimum'
        ELSE 'Normal'
    END AS status_stok
FROM m_barang mb
LEFT JOIN d_barang db ON mb.kode_barang = db.kode_barang
GROUP BY mb.kode_barang, mb.nama_barang, mb.satuan, mb.stok_min, mb.lokasi;

-- 20. VIEW v_financial_report (NO CHANGE - Already compatible)
CREATE OR REPLACE VIEW v_financial_report AS
SELECT 
    j.tanggal,
    j.kode_coa,
    mc.nama_coa,
    mc.saldo_normal,
    j.debet,
    j.credit,
    CASE 
        WHEN mc.saldo_normal = 'Debit' THEN j.debet - j.credit
        ELSE j.credit - j.debet
    END AS adjusted_balance
FROM journal j
JOIN m_coa mc ON j.kode_coa = mc.kode_coa
ORDER BY j.tanggal, j.id;

-- 21. VIEW v_aging_report (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_aging_report AS
SELECT 
    i.no_invoice,
    i.tgl_faktur,
    i.jatuh_tempo,
    i.kode_cust,
    mc.nama_cust,
    i.grand_total,
    i.sisa_invoice,
    i.status,
    CURRENT_DATE - i.jatuh_tempo AS days_overdue,
    CASE 
        WHEN CURRENT_DATE - i.jatuh_tempo <= 0 THEN 'Belum Jatuh Tempo'
        WHEN CURRENT_DATE - i.jatuh_tempo BETWEEN 1 AND 30 THEN '1-30 Hari'
        WHEN CURRENT_DATE - i.jatuh_tempo BETWEEN 31 AND 60 THEN '31-60 Hari'
        WHEN CURRENT_DATE - i.jatuh_tempo BETWEEN 61 AND 90 THEN '61-90 Hari'
        ELSE 'Lebih dari 90 Hari'
    END AS kategori_aging
FROM invoice i
JOIN m_cust mc ON i.kode_cust = mc.kode_cust
WHERE i.sisa_invoice > 0 AND i.status != 'Cancel';

-- 22. VIEW v_sales_summary (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_sales_summary AS
SELECT 
    i.kode_sales,
    ms.nama_sales,
    ma.area,
    EXTRACT(MONTH FROM i.tgl_faktur) AS bulan,
    EXTRACT(YEAR FROM i.tgl_faktur) AS tahun,
    COUNT(*) AS jumlah_invoice,
    SUM(i.grand_total) AS total_penjualan,
    AVG(i.grand_total) AS rata_rata_invoice
FROM invoice i
JOIN m_sales ms ON i.kode_sales = ms.kode_sales
LEFT JOIN m_area ma ON ms.kode_area = ma.kode_area
WHERE i.status != 'Cancel'
GROUP BY i.kode_sales, ms.nama_sales, ma.area, 
         EXTRACT(MONTH FROM i.tgl_faktur), EXTRACT(YEAR FROM i.tgl_faktur);

-- 23. VIEW v_return_summary (FIXED - Removed kode_divisi)
CREATE OR REPLACE VIEW v_return_summary AS
SELECT 
    rs.no_retur,
    rs.tgl_retur,
    rs.kode_cust,
    mc.nama_cust,
    rs.status,
    rs.total,
    rs.sisa_retur,
    COUNT(rsd.kode_barang) AS jumlah_item,
    SUM(rsd.qty_retur) AS total_qty_retur,
    CASE 
        WHEN rs.sisa_retur <= 0 THEN 'Lunas'
        WHEN rs.sisa_retur = rs.total THEN 'Belum Diproses'
        ELSE 'Sebagian'
    END AS kategori_retur
FROM return_sales rs
JOIN m_cust mc ON rs.kode_cust = mc.kode_cust
LEFT JOIN return_sales_detail rsd ON rs.no_retur = rsd.no_retur
GROUP BY rs.no_retur, rs.tgl_retur, rs.kode_cust, mc.nama_cust, 
         rs.status, rs.total, rs.sisa_retur;

-- 24. VIEW v_dashboard_kpi (FIXED - Updated for single-tenant)
CREATE OR REPLACE VIEW v_dashboard_kpi AS
SELECT 
    (SELECT COUNT(*) FROM invoice WHERE status != 'Cancel') AS total_invoice,
    (SELECT COUNT(*) FROM invoice WHERE status != 'Cancel' AND tgl_faktur >= CURRENT_DATE - 30) AS invoice_bulan_ini,
    (SELECT SUM(grand_total) FROM invoice WHERE status != 'Cancel' AND tgl_faktur >= CURRENT_DATE - 30) AS penjualan_bulan_ini,
    (SELECT AVG(grand_total) FROM invoice WHERE status != 'Cancel' AND tgl_faktur >= CURRENT_DATE - 30) AS rata_rata_penjualan_bulanan,
    (SELECT COUNT(*) FROM m_cust) AS total_customer,
    (SELECT COUNT(*) FROM m_barang WHERE status = true) AS total_barang_aktif,
    (SELECT COUNT(*) FROM return_sales WHERE tgl_retur >= CURRENT_DATE - 30) AS retur_bulan_ini,
    (SELECT SUM(sisa_invoice) FROM invoice WHERE sisa_invoice > 0 AND status != 'Cancel') AS total_piutang;

-- INDEXES untuk optimasi performance VIEW
-- =======================================
-- Note: Indexes ini sebaiknya dibuat setelah semua data di-load

/*
CREATE INDEX CONCURRENTLY idx_invoice_performance ON invoice(tgl_faktur, status);
CREATE INDEX CONCURRENTLY idx_invoice_detail_performance ON invoice_detail(no_invoice, kode_barang);
CREATE INDEX CONCURRENTLY idx_kartu_stok_performance ON kartu_stok(kode_barang, tgl_proses);
CREATE INDEX CONCURRENTLY idx_journal_performance ON journal(tanggal, kode_coa);
CREATE INDEX CONCURRENTLY idx_return_sales_performance ON return_sales(tgl_retur, status);
CREATE INDEX CONCURRENTLY idx_part_penerimaan_performance ON part_penerimaan(tgl_penerimaan, status);
CREATE INDEX CONCURRENTLY idx_penerimaan_finance_performance ON penerimaan_finance(tgl_penerimaan, status);
*/
