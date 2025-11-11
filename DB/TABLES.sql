-- Tabel m_coa
CREATE TABLE IF NOT EXISTS m_coa (
    kode_coa VARCHAR(15) PRIMARY KEY,
    nama_coa VARCHAR(100) NOT NULL,
    saldo_normal VARCHAR(50) NOT NULL CHECK (saldo_normal IN ('Debit', 'Kredit'))
);

-- Tabel bank (penggabungan m_bank dan d_bank)
CREATE TABLE bank (
    no_rekening VARCHAR(50) PRIMARY KEY,
    atas_nama VARCHAR(50) NOT NULL,
    kode_bank VARCHAR(5),
    nama_bank VARCHAR(50) NOT NULL,
    saldo NUMERIC(15,2) DEFAULT 0,
    status_rekening VARCHAR(50),
    status_bank BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabel m_area
CREATE TABLE m_area (
    kode_area VARCHAR(10) NOT NULL,
    area VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (kode_area)
);

-- Tabel m_sales
CREATE TABLE m_sales (
    kode_sales VARCHAR(15) NOT NULL,
    nama_sales VARCHAR(50) NOT NULL,
    kode_area VARCHAR(5),
    alamat VARCHAR(500),
    no_hp VARCHAR(20),
    target NUMERIC(15,2),
    status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (kode_sales)
);

-- Tabel m_cust
CREATE TABLE m_cust (
    kode_cust VARCHAR(5) NOT NULL,
    nama_cust VARCHAR(200) NOT NULL,
    kode_area VARCHAR(5) NOT NULL,
    alamat VARCHAR(500),
    telp VARCHAR(50),
    contact VARCHAR(50),
    credit_limit NUMERIC(15,2),
    jatuh_tempo INT,
    status BOOLEAN DEFAULT TRUE,
    no_npwp VARCHAR(20),
    nama_pajak VARCHAR(100),
    alamat_pajak VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (kode_cust)
);

-- Tabel m_kategori
CREATE TABLE m_kategori (
    kode_kategori VARCHAR(10) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (kode_kategori)
);

-- Tabel m_barang
CREATE TABLE m_barang (
    kode_barang VARCHAR(30) NOT NULL,
    nama_barang VARCHAR(70) NOT NULL,
    kode_kategori VARCHAR(10) NOT NULL,
    harga_list NUMERIC(15,2),
    harga_jual NUMERIC(15,2),
    satuan VARCHAR(20),
    disc1 NUMERIC(5,2),
    disc2 NUMERIC(5,2),
    merk VARCHAR(50),
    barcode VARCHAR(8),
    status BOOLEAN DEFAULT TRUE,
    lokasi VARCHAR(50),
    stok_min INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (kode_barang)
);

-- Tabel d_barang
CREATE TABLE d_barang (
    id SERIAL PRIMARY KEY,
    kode_barang VARCHAR(30) NOT NULL,
    tgl_masuk TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modal NUMERIC(15,2),
    stok INT DEFAULT 0
);

-- Tabel m_supplier
CREATE TABLE m_supplier (
    kode_supplier VARCHAR(15) NOT NULL,
    nama_supplier VARCHAR(50) NOT NULL,
    alamat VARCHAR(100),
    telp VARCHAR(50),
    contact VARCHAR(50),
    status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (kode_supplier)
);

-- Tabel m_trans
CREATE TABLE m_trans (
    kode_trans VARCHAR(30) PRIMARY KEY,
    transaksi VARCHAR(100) NOT NULL
);

-- Tabel d_trans
CREATE TABLE d_trans (
    kode_trans VARCHAR(30) NOT NULL,
    kode_coa VARCHAR(15) NOT NULL,
    saldo_normal VARCHAR(50) NOT NULL CHECK (saldo_normal IN ('Debit', 'Kredit'))
);

-- Tabel invoice
CREATE TABLE invoice (
    no_invoice VARCHAR(15) NOT NULL,
    tgl_faktur DATE NOT NULL,
    kode_cust VARCHAR(5) NOT NULL,
    kode_sales VARCHAR(5),
    tipe VARCHAR(1) CHECK (tipe IN ('1', '2')),
    jatuh_tempo DATE NOT NULL,
    total NUMERIC(15,2) NOT NULL,
    disc NUMERIC(5,2) DEFAULT 0,
    pajak NUMERIC(5,2) DEFAULT 0,
    grand_total NUMERIC(15,2) NOT NULL,
    sisa_invoice NUMERIC(15,2) NOT NULL,
    ket TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Open', 'Lunas', 'Belum Lunas', 'Partial', 'Cancel')),
    username VARCHAR(50) NOT NULL,
    tt VARCHAR(15),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (no_invoice)
);

-- Tabel invoice_detail
CREATE TABLE invoice_detail (
    id SERIAL PRIMARY KEY,
    no_invoice VARCHAR(15) NOT NULL,
    kode_barang VARCHAR(50) NOT NULL,
    qty_supply INT NOT NULL,
    harga_jual NUMERIC(15,2) NOT NULL,
    jenis VARCHAR(50),
    diskon1 NUMERIC(5,2),
    diskon2 NUMERIC(5,2),
    harga_nett NUMERIC(15,2) NOT NULL,
    status VARCHAR(50)
);

-- Tabel journal
CREATE TABLE journal (
    id SERIAL PRIMARY KEY,
    tanggal DATE NOT NULL,
    transaksi VARCHAR(100),
    kode_coa VARCHAR(15) NOT NULL,
    keterangan VARCHAR(100),
    debet NUMERIC(15,2) DEFAULT 0,
    credit NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabel kartu_stok
CREATE TABLE kartu_stok (
    urut SERIAL PRIMARY KEY,
    kode_barang VARCHAR(30) NOT NULL,
    no_ref VARCHAR(15),
    tgl_proses TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    tipe VARCHAR(50),
    increase INT DEFAULT 0,
    decrease INT DEFAULT 0,
    harga_debet NUMERIC(15,2) DEFAULT 0,
    harga_kredit NUMERIC(15,2) DEFAULT 0,
    qty INT DEFAULT 0,
    hpp NUMERIC(15,2) DEFAULT 0
);

-- Tabel part_penerimaan
CREATE TABLE part_penerimaan (
    no_penerimaan VARCHAR(15) NOT NULL,
    tgl_penerimaan DATE NOT NULL,
    kode_valas VARCHAR(3),
    kurs NUMERIC(15,2),
    kode_supplier VARCHAR(5) NOT NULL,
    jatuh_tempo DATE,
    no_faktur VARCHAR(50),
    total NUMERIC(15,2),
    discount NUMERIC(5,2),
    pajak NUMERIC(5,2),
    grand_total NUMERIC(15,2),
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (no_penerimaan)
);

-- Tabel part_penerimaan_detail
CREATE TABLE part_penerimaan_detail (
    no_penerimaan VARCHAR(15) NOT NULL,
    kode_barang VARCHAR(30) NOT NULL,
    qty_supply INT NOT NULL,
    harga NUMERIC(15,2) NOT NULL,
    diskon1 NUMERIC(5,2),
    diskon2 NUMERIC(5,2),
    harga_nett NUMERIC(15,2) NOT NULL
);

-- Tabel m_tt
CREATE TABLE m_tt (
    no_tt VARCHAR(15) NOT NULL,
    tanggal DATE NOT NULL,
    kode_cust VARCHAR(5) NOT NULL,
    keterangan VARCHAR(500),
    PRIMARY KEY (no_tt)
);

-- Tabel d_tt
CREATE TABLE d_tt (
    id SERIAL PRIMARY KEY,
    no_tt VARCHAR(15) NOT NULL,
    no_ref VARCHAR(15) NOT NULL
);

-- Tabel m_voucher
CREATE TABLE m_voucher (
    no_voucher VARCHAR(15) NOT NULL,
    tanggal DATE NOT NULL,
    kode_sales VARCHAR(5) NOT NULL,
    total_omzet NUMERIC(15,2),
    komisi NUMERIC(5,2),
    jumlah_komisi NUMERIC(15,2),
    PRIMARY KEY (no_voucher)
);

-- Tabel d_voucher
CREATE TABLE d_voucher (
    id SERIAL PRIMARY KEY,
    no_voucher VARCHAR(15) NOT NULL,
    no_penerimaan VARCHAR(15) NOT NULL
);

-- Tabel master_user
CREATE TABLE master_user (
    username VARCHAR(50) NOT NULL,
    nama VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY (username)
);

-- Tabel saldo_bank
CREATE TABLE saldo_bank (
    id SERIAL PRIMARY KEY,
    no_rekening VARCHAR(50) NOT NULL,
    tgl_proses DATE NOT NULL,
    keterangan VARCHAR(500),
    debet NUMERIC(15,2) DEFAULT 0,
    kredit NUMERIC(15,2) DEFAULT 0,
    saldo NUMERIC(15,2) DEFAULT 0
);

-- Tabel return_sales
CREATE TABLE return_sales (
    no_retur VARCHAR(15) NOT NULL,
    tgl_retur DATE NOT NULL,
    kode_cust VARCHAR(5) NOT NULL,
    total NUMERIC(15,2) NOT NULL,
    sisa_retur NUMERIC(15,2) NOT NULL,
    keterangan VARCHAR(200),
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel')),
    tipe_retur VARCHAR(20) DEFAULT 'sales' CHECK (tipe_retur IN ('sales', 'supplier')),
    tt VARCHAR(15),
    PRIMARY KEY (no_retur)
);

-- Tabel return_sales_detail
CREATE TABLE return_sales_detail (
    id SERIAL PRIMARY KEY,
    no_retur VARCHAR(15) NOT NULL,
    no_invoice VARCHAR(15) NOT NULL,
    kode_barang VARCHAR(30) NOT NULL,
    qty_retur INT NOT NULL,
    harga_nett NUMERIC(15,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel'))
);

-- Tabel retur_penerimaan
CREATE TABLE retur_penerimaan (
    no_retur VARCHAR(15) NOT NULL,
    tgl_retur DATE NOT NULL,
    kode_supplier VARCHAR(5) NOT NULL,
    total NUMERIC(15,2) NOT NULL,
    sisa_retur NUMERIC(15,2) NOT NULL,
    keterangan VARCHAR(200),
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel')),
    PRIMARY KEY (no_retur)
);

-- Tabel retur_penerimaan_detail
CREATE TABLE retur_penerimaan_detail (
    id SERIAL PRIMARY KEY,
    no_retur VARCHAR(15) NOT NULL,
    no_penerimaan VARCHAR(15) NOT NULL,
    kode_barang VARCHAR(30) NOT NULL,
    qty_retur INT NOT NULL,
    harga_nett NUMERIC(15,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel'))
);

-- Tabel penerimaan_finance (sudah termasuk m_resi)
CREATE TABLE penerimaan_finance (
    no_penerimaan VARCHAR(15) NOT NULL,
    tgl_penerimaan DATE NOT NULL,
    tipe VARCHAR(50),
    no_ref VARCHAR(50),
    tgl_ref DATE,
    tgl_pencairan DATE,
    bank_ref VARCHAR(5),
    no_rek_tujuan VARCHAR(50),
    kode_cust VARCHAR(5),
    jumlah NUMERIC(15,2) NOT NULL,
    keterangan TEXT,
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel')),
    no_voucher VARCHAR(15),
    PRIMARY KEY (no_penerimaan)
);

-- Tabel penerimaan_finance_detail
CREATE TABLE penerimaan_finance_detail (
    id SERIAL PRIMARY KEY,
    no_penerimaan VARCHAR(15) NOT NULL,
    no_invoice VARCHAR(15) NOT NULL,
    jumlah_invoice NUMERIC(15,2) NOT NULL,
    sisa_invoice NUMERIC(15,2) NOT NULL,
    jumlah_bayar NUMERIC(15,2) NOT NULL,
    jumlah_dispensasi NUMERIC(15,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Open', 'Finish', 'Cancel'))
);

-- Tabel m_dokumen
CREATE TABLE m_dokumen (
    kode_dok VARCHAR(50) NOT NULL,
    nomor VARCHAR(15) NOT NULL,
    PRIMARY KEY (kode_dok)
);

-- Tabel d_paket
CREATE TABLE d_paket (
    id SERIAL PRIMARY KEY,
    kode_paket VARCHAR(10) NOT NULL,
    kode_kategori VARCHAR(30) NOT NULL,
    qty_min INT,
    qty_max INT,
    diskon1 NUMERIC(5,2),
    diskon2 NUMERIC(5,2)
);

-- Tabel stok_minimum
CREATE TABLE stok_minimum (
    kode_barang VARCHAR(30) NOT NULL,
    tanggal DATE NOT NULL,
    stok INT NOT NULL,
    stok_min INT NOT NULL,
    PRIMARY KEY (kode_barang, tanggal)
);

-- INDEX untuk meningkatkan performa
-- =================================

-- Index untuk tabel invoice
CREATE INDEX idx_invoice_tgl_faktur ON invoice(tgl_faktur);
CREATE INDEX idx_invoice_kode_cust ON invoice(kode_cust);
CREATE INDEX idx_invoice_status ON invoice(status);

-- Index untuk tabel journal
CREATE INDEX idx_journal_tanggal ON journal(tanggal);
CREATE INDEX idx_journal_kode_coa ON journal(kode_coa);

-- Index untuk tabel kartu_stok
CREATE INDEX idx_kartu_stok_kode_barang ON kartu_stok(kode_barang);
CREATE INDEX idx_kartu_stok_tgl_proses ON kartu_stok(tgl_proses);

-- Index untuk tabel part_penerimaan
CREATE INDEX idx_part_penerimaan_tgl ON part_penerimaan(tgl_penerimaan);
CREATE INDEX idx_part_penerimaan_supplier ON part_penerimaan(kode_supplier);

-- Index untuk tabel return_sales
CREATE INDEX idx_return_sales_tgl ON return_sales(tgl_retur);
CREATE INDEX idx_return_sales_cust ON return_sales(kode_cust);

-- Index untuk tabel penerimaan_finance
CREATE INDEX idx_penerimaan_finance_tgl ON penerimaan_finance(tgl_penerimaan);
CREATE INDEX idx_penerimaan_finance_cust ON penerimaan_finance(kode_cust);