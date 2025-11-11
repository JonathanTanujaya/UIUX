-- =================================================================
-- POSTGRESQL STORED PROCEDURES UNTUK SISTEM SINGLE-TENANT
-- =================================================================
-- File: uptProcedure_fixed.sql (Fixed for Single-Tenant Architecture)
-- Date: 2025-09-18
-- 
-- Deskripsi: 
-- File ini berisi definisi stored procedure yang telah diperbaiki
-- untuk arsitektur single-tenant (menghapus kode_divisi)
-- =================================================================

-- 1. PROCEDURE sp_invoice (FIXED - Removed kode_divisi)
CREATE OR REPLACE PROCEDURE sp_invoice(
    p_no_invoice VARCHAR(15),
    p_kode_cust VARCHAR(5),
    p_kode_sales VARCHAR(5),
    p_tipe CHAR(1),
    p_total NUMERIC(15,2),
    p_disc NUMERIC(5,2),
    p_pajak NUMERIC(5,2),
    p_grand_total NUMERIC(15,2),
    p_ket TEXT,
    p_kode_barang VARCHAR(50),
    p_qty_supply INT,
    p_harga_jual NUMERIC(15,2),
    p_diskon1 NUMERIC(5,2),
    p_diskon2 NUMERIC(5,2),
    p_harga_nett NUMERIC(15,2),
    p_user VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_jatuhtempo DATE;
    v_top INT;
    v_idbarang BIGINT;
    v_stoks BIGINT;
    v_qtybaru BIGINT;
    v_modal NUMERIC(15,2);
    v_qty_supply_remaining INT := p_qty_supply;
    cur_stok CURSOR FOR 
        SELECT id, stok, modal FROM d_barang 
        WHERE kode_barang = p_kode_barang AND stok > 0
        ORDER BY tgl_masuk ASC;
BEGIN
    -- Cek jika invoice sudah ada
    IF NOT EXISTS (SELECT 1 FROM invoice WHERE no_invoice = p_no_invoice) THEN
        -- Get jatuh tempo from customer
        SELECT jatuh_tempo INTO v_top FROM m_cust WHERE kode_cust = p_kode_cust;
        v_jatuhtempo := CURRENT_DATE + INTERVAL '1 day' * COALESCE(v_top, 0);
        
        -- Insert invoice header
        INSERT INTO invoice(
            no_invoice, tgl_faktur, kode_cust, kode_sales, tipe, 
            jatuh_tempo, total, disc, pajak, grand_total, sisa_invoice, 
            ket, status, username
        ) VALUES (
            p_no_invoice, CURRENT_DATE, p_kode_cust, p_kode_sales, p_tipe,
            v_jatuhtempo, p_total, p_disc, p_pajak, p_grand_total, p_grand_total,
            p_ket, 'Open', p_user
        );
    END IF;
    
    -- Insert into invoice_detail
    INSERT INTO invoice_detail(
        no_invoice, kode_barang, qty_supply, 
        harga_jual, diskon1, diskon2, harga_nett, status
    ) VALUES (
        p_no_invoice, p_kode_barang, p_qty_supply,
        p_harga_jual, p_diskon1, p_diskon2, p_harga_nett, 'Open'
    );
    
    -- Process stock reduction using FIFO
    OPEN cur_stok;
    LOOP
        FETCH cur_stok INTO v_idbarang, v_stoks, v_modal;
        EXIT WHEN NOT FOUND OR v_qty_supply_remaining <= 0;
        
        IF v_stoks >= v_qty_supply_remaining THEN
            -- Update stock
            UPDATE d_barang SET stok = stok - v_qty_supply_remaining WHERE id = v_idbarang;
            
            -- Insert kartu stok
            SELECT COALESCE(SUM(stok), 0) INTO v_qtybaru FROM d_barang WHERE kode_barang = p_kode_barang;
            INSERT INTO kartu_stok(kode_barang, no_ref, tgl_proses, tipe, increase, decrease, harga_debet, harga_kredit, hpp, qty)
            VALUES (p_kode_barang, p_no_invoice, CURRENT_TIMESTAMP, 'Penjualan', 0, v_qty_supply_remaining, 0, p_harga_nett, v_modal, v_qtybaru);
            
            v_qty_supply_remaining := 0;
        ELSE
            -- Take all available stock
            UPDATE d_barang SET stok = 0 WHERE id = v_idbarang;
            
            SELECT COALESCE(SUM(stok), 0) INTO v_qtybaru FROM d_barang WHERE kode_barang = p_kode_barang;
            INSERT INTO kartu_stok(kode_barang, no_ref, tgl_proses, tipe, increase, decrease, harga_debet, harga_kredit, hpp, qty)
            VALUES (p_kode_barang, p_no_invoice, CURRENT_TIMESTAMP, 'Penjualan', 0, v_stoks, 0, p_harga_nett, v_modal, v_qtybaru);
            
            v_qty_supply_remaining := v_qty_supply_remaining - v_stoks;
        END IF;
    END LOOP;
    CLOSE cur_stok;
END;
$$;

-- 2. PROCEDURE sp_journal_invoice (NO CHANGE - Already Compatible)
CREATE OR REPLACE PROCEDURE sp_journal_invoice(p_no_invoice VARCHAR(15))
LANGUAGE plpgsql
AS $$
DECLARE
    v_grand_total NUMERIC(15,2);
    v_total NUMERIC(15,2);
    v_hpp NUMERIC(15,2);
    v_insentif NUMERIC(5,2) := 1;
BEGIN
    -- Get invoice values
    SELECT grand_total, total INTO v_grand_total, v_total
    FROM invoice WHERE no_invoice = p_no_invoice;
    
    -- Calculate HPP
    SELECT COALESCE(SUM(hpp * decrease), 0) INTO v_hpp
    FROM kartu_stok WHERE no_ref = p_no_invoice;
    
    -- Insert journal entries
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '1-1210', p_no_invoice, v_grand_total, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '4-1001', p_no_invoice, 0, v_total);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '2-1301', p_no_invoice, 0, v_grand_total - v_total);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '5-1001', p_no_invoice, v_hpp, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '1-1301', p_no_invoice, 0, v_hpp);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '6-1020', p_no_invoice, v_insentif * v_total / 100, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Penjualan', '2-1470', p_no_invoice, 0, v_insentif * v_total / 100);
END;
$$;

-- 3. PROCEDURE sp_journal_retur_sales (NO CHANGE - Already Compatible)
CREATE OR REPLACE PROCEDURE sp_journal_retur_sales(p_no_retur VARCHAR(15))
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_retur NUMERIC(15,2);
    v_hpp NUMERIC(15,2);
    v_insentif NUMERIC(5,2) := 1;
BEGIN
    SELECT total INTO v_total_retur FROM return_sales WHERE no_retur = p_no_retur;
    
    SELECT COALESCE(SUM(hpp), 0) INTO v_hpp
    FROM kartu_stok WHERE no_ref = p_no_retur;
    
    -- Reversal entries
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '4-1001', p_no_retur, v_total_retur / 1.1, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '2-1301', p_no_retur, v_total_retur - (v_total_retur / 1.1), 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '1-1210', p_no_retur, 0, v_total_retur);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '1-1301', p_no_retur, v_hpp, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '5-1001', p_no_retur, 0, v_hpp);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '2-1470', p_no_retur, v_insentif * (v_total_retur / 1.1) / 100, 0);
    
    INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit)
    VALUES (CURRENT_DATE, 'Retur Penjualan', '6-1020', p_no_retur, 0, v_insentif * (v_total_retur / 1.1) / 100);
END;
$$;

-- 4. PROCEDURE sp_penerimaan_finance (FIXED - Replaces sp_master_resi)
CREATE OR REPLACE PROCEDURE sp_penerimaan_finance(
    p_no_penerimaan VARCHAR(15),
    p_no_rekening_tujuan VARCHAR(50),
    p_tgl_bayar DATE,
    p_kode_cust VARCHAR(50),
    p_keterangan TEXT,
    p_nominal NUMERIC(15,2)
)
LANGUAGE plpgsql
AS $
DECLARE
    v_saldo NUMERIC(15,2);
BEGIN
    -- Insert into penerimaan_finance
    INSERT INTO penerimaan_finance (
        no_penerimaan, tgl_penerimaan, tipe, no_rek_tujuan, 
        kode_cust, jumlah, keterangan, status
    ) VALUES (
        p_no_penerimaan, p_tgl_bayar, 'Resi', p_no_rekening_tujuan, 
        p_kode_cust, p_nominal, p_keterangan, 'Open'
    );
    
    -- Update bank balance
    SELECT COALESCE(saldo, 0) INTO v_saldo 
    FROM rekening_bank 
    WHERE no_rekening = p_no_rekening_tujuan;
    
    v_saldo := v_saldo + p_nominal;
    
    -- Insert into saldo_bank
    INSERT INTO saldo_bank(
        no_rekening, tgl_proses, keterangan,
        debet, kredit, saldo
    ) VALUES (
        p_no_rekening_tujuan, CURRENT_DATE, p_keterangan,
        p_nominal, 0, v_saldo
    );
    
    -- Update bank
    UPDATE rekening_bank SET saldo = v_saldo 
    WHERE no_rekening = p_no_rekening_tujuan;
END;
$;

-- 5. PROCEDURE sp_part_penerimaan (FIXED - Removed kode_divisi)
CREATE OR REPLACE PROCEDURE sp_part_penerimaan(
    p_no_penerimaan VARCHAR(15),
    p_tgl_penerimaan DATE,
    p_kode_valas VARCHAR(3),
    p_kurs NUMERIC(15,2),
    p_kode_supplier VARCHAR(5),
    p_jatuh_tempo DATE,
    p_no_faktur VARCHAR(50),
    p_total NUMERIC(15,2),
    p_disc NUMERIC(5,2),
    p_pajak NUMERIC(5,2),
    p_grand_total NUMERIC(15,2),
    p_kode_barang VARCHAR(30),
    p_qty_supply INT,
    p_harga NUMERIC(15,2),
    p_harga_nett NUMERIC(15,2),
    p_diskon1 NUMERIC(5,2),
    p_diskon2 NUMERIC(5,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_qty_lama INT;
BEGIN
    -- Insert header if not exists
    IF NOT EXISTS (SELECT 1 FROM part_penerimaan WHERE no_penerimaan = p_no_penerimaan) THEN
        INSERT INTO part_penerimaan(
            no_penerimaan, tgl_penerimaan, kode_valas, kurs, kode_supplier,
            jatuh_tempo, no_faktur, total, disc, pajak, grand_total, 
            sisa_penerimaan, status
        ) VALUES (
            p_no_penerimaan, p_tgl_penerimaan, p_kode_valas, p_kurs, p_kode_supplier,
            p_jatuh_tempo, p_no_faktur, p_total, p_disc, p_pajak, p_grand_total,
            p_grand_total, 'Open'
        );
        
        -- Journal entry for purchase
        INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit) 
        VALUES (CURRENT_DATE, 'Pembelian', '1-1301', p_no_faktur, p_grand_total, 0);
        INSERT INTO journal(tanggal, transaksi, kode_coa, keterangan, debet, credit) 
        VALUES (CURRENT_DATE, 'Pembelian', '2-1110', p_no_faktur, 0, p_grand_total);
    END IF;
    
    -- Insert detail
    INSERT INTO part_penerimaan_detail(
        no_penerimaan, kode_barang, qty_supply,
        harga, diskon1, diskon2, harga_nett
    ) VALUES (
        p_no_penerimaan, p_kode_barang, p_qty_supply,
        p_harga, p_diskon1, p_diskon2, p_harga_nett
    );
    
    -- Update or insert d_barang
    IF EXISTS (SELECT 1 FROM d_barang WHERE kode_barang = p_kode_barang AND modal = p_harga_nett) THEN
        UPDATE d_barang SET stok = stok + p_qty_supply 
        WHERE kode_barang = p_kode_barang AND modal = p_harga_nett;
    ELSE
        INSERT INTO d_barang(kode_barang, modal, tgl_masuk, stok) 
        VALUES (p_kode_barang, p_harga_nett, p_tgl_penerimaan, p_qty_supply);
    END IF;
    
    -- Insert kartu stok
    SELECT COALESCE(SUM(stok), 0) INTO v_qty_lama FROM d_barang WHERE kode_barang = p_kode_barang;
    
    INSERT INTO kartu_stok(kode_barang, no_ref, tgl_proses, tipe, increase, decrease, harga_debet, harga_kredit, qty)
    VALUES (p_kode_barang, p_no_penerimaan, CURRENT_TIMESTAMP, 'Pembelian', p_qty_supply, 0, p_harga_nett, 0, v_qty_lama);
END;
$$;

-- 6. PROCEDURE sp_pembatalan_invoice (FIXED - Removed kode_divisi)
CREATE OR REPLACE PROCEDURE sp_pembatalan_invoice(p_no_invoice VARCHAR(15))
LANGUAGE plpgsql
AS $$
DECLARE
    r_record RECORD;
    cur_data CURSOR FOR 
        SELECT kode_barang, harga_kredit, hpp, decrease, urut 
        FROM kartu_stok
        WHERE no_ref = p_no_invoice;
BEGIN
    FOR r_record IN cur_data LOOP
        -- Restore stock
        UPDATE d_barang SET stok = stok + r_record.decrease 
        WHERE kode_barang = r_record.kode_barang AND modal = r_record.hpp;
        
        -- Recalculate stock
        CALL sp_rekalkulasi(r_record.kode_barang);
    END LOOP;
    
    -- Cancel invoice
    UPDATE invoice SET status = 'Cancel', total = 0, disc = 0, pajak = 0, grand_total = 0, sisa_invoice = 0
    WHERE no_invoice = p_no_invoice;
    
    UPDATE invoice_detail SET status = 'Cancel' WHERE no_invoice = p_no_invoice;
    DELETE FROM journal WHERE keterangan = p_no_invoice;
END;
$$;

-- 7. PROCEDURE sp_rekalkulasi (FIXED - Removed kode_divisi)
CREATE OR REPLACE PROCEDURE sp_rekalkulasi(p_kode_barang VARCHAR(30))
LANGUAGE plpgsql
AS $$
DECLARE
    v_qty INT := 0;
    r_record RECORD;
    cur_data CURSOR FOR 
        SELECT urut, tipe, increase, decrease 
        FROM kartu_stok
        WHERE kode_barang = p_kode_barang
        ORDER BY urut;
BEGIN
    FOR r_record IN cur_data LOOP
        v_qty := v_qty + r_record.increase - r_record.decrease;
        UPDATE kartu_stok SET qty = v_qty WHERE urut = r_record.urut;
    END LOOP;
END;
$$;

-- 8. PROCEDURE sp_retur_sales (FIXED - Removed kode_divisi)
CREATE OR REPLACE PROCEDURE sp_retur_sales(
    p_no_retur VARCHAR(15),
    p_kode_cust VARCHAR(5),
    p_ket TEXT,
    p_total NUMERIC(15,2),
    p_no_invoice VARCHAR(15),
    p_kode_barang VARCHAR(30),
    p_qty_retur INT,
    p_harga_nett NUMERIC(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    r_record RECORD;
    v_qty_retur_remaining INT := p_qty_retur;
    v_qty_lama INT;
    cur_data CURSOR FOR 
        SELECT hpp, decrease FROM kartu_stok 
        WHERE kode_barang = p_kode_barang AND no_ref = p_no_invoice ORDER BY hpp;
BEGIN
    -- Insert header if not exists
    IF NOT EXISTS (SELECT 1 FROM return_sales WHERE no_retur = p_no_retur) THEN
        INSERT INTO return_sales(no_retur, tgl_retur, kode_cust, total, sisa_retur, keterangan, status)
        VALUES (p_no_retur, CURRENT_DATE, p_kode_cust, p_total, p_total, p_ket, 'Open');
    END IF;
    
    -- Insert detail
    INSERT INTO return_sales_detail(no_retur, no_invoice, kode_barang, qty_retur, harga_nett, status)
    VALUES (p_no_retur, p_no_invoice, p_kode_barang, p_qty_retur, p_harga_nett, 'Open');
    
    -- Restore stock using FIFO
    FOR r_record IN cur_data LOOP
        EXIT WHEN v_qty_retur_remaining <= 0;
        
        IF r_record.decrease >= v_qty_retur_remaining THEN
            -- Restore stock
            UPDATE d_barang SET stok = stok + v_qty_retur_remaining 
            WHERE kode_barang = p_kode_barang AND modal = r_record.hpp;
            
            SELECT COALESCE(SUM(stok), 0) INTO v_qty_lama FROM d_barang WHERE kode_barang = p_kode_barang;
            INSERT INTO kartu_stok(kode_barang, no_ref, tgl_proses, tipe, increase, decrease, harga_debet, harga_kredit, hpp, qty)
            VALUES (p_kode_barang, p_no_retur, CURRENT_TIMESTAMP, 'Retur Penjualan', v_qty_retur_remaining, 0, r_record.hpp, 0, r_record.hpp, v_qty_lama);
            
            v_qty_retur_remaining := 0;
        END IF;
    END LOOP;
END;
$$;

-- 9. PROCEDURE sp_set_nomor (NO CHANGE - Already Compatible)
CREATE OR REPLACE PROCEDURE sp_set_nomor(
    p_kode_dok VARCHAR(50),
    INOUT p_nomor VARCHAR(15) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_nomor_lama VARCHAR(15);
    v_nomor_baru VARCHAR(15);
    v_tahun VARCHAR(4);
    v_bulan VARCHAR(2);
    v_counter INT;
BEGIN
    v_tahun := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    v_bulan := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::VARCHAR, 2, '0');
    
    IF EXISTS (SELECT 1 FROM m_dokumen WHERE kode_dok = p_kode_dok) THEN
        SELECT nomor INTO v_nomor_lama FROM m_dokumen WHERE kode_dok = p_kode_dok;
        
        -- Extract counter and increment
        v_counter := COALESCE(CAST(SUBSTRING(v_nomor_lama FROM '(\d+)$') AS INT), 0) + 1;
        v_nomor_baru := v_tahun || '/' || v_bulan || '/' || p_kode_dok || '/' || LPAD(v_counter::VARCHAR, 4, '0');
        
        UPDATE m_dokumen SET nomor = v_nomor_baru WHERE kode_dok = p_kode_dok;
    ELSE
        v_nomor_baru := v_tahun || '/' || v_bulan || '/' || p_kode_dok || '/0001';
        INSERT INTO m_dokumen(kode_dok, nomor) VALUES (p_kode_dok, v_nomor_baru);
    END IF;
    
    p_nomor := v_nomor_baru;
END;
$$;

-- 10. PROCEDURE sp_tambah_saldo (FIXED - Using bank instead of d_bank)
CREATE OR REPLACE PROCEDURE sp_tambah_saldo(
    p_no_rekening VARCHAR(50),
    p_keterangan VARCHAR(500),
    p_nominal NUMERIC(15,2)
)
LANGUAGE plpgsql
AS $
DECLARE
    v_saldo NUMERIC(15,2);
BEGIN
    SELECT COALESCE(saldo, 0) INTO v_saldo FROM rekening_bank WHERE no_rekening = p_no_rekening;
    v_saldo := v_saldo + p_nominal;
    
    INSERT INTO saldo_bank(no_rekening, tgl_proses, keterangan, debet, kredit, saldo)
    VALUES (p_no_rekening, CURRENT_DATE, p_keterangan, p_nominal, 0, v_saldo);
    
    UPDATE rekening_bank SET saldo = v_saldo WHERE no_rekening = p_no_rekening;
END;
$;

-- 11. PROCEDURE sp_tanda_terima (NO CHANGE - Already Compatible)
CREATE OR REPLACE PROCEDURE sp_tanda_terima(
    p_no_tt VARCHAR(15),
    p_no_ref VARCHAR(15)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if TT exists
    IF NOT EXISTS (SELECT 1 FROM m_tt WHERE no_tt = p_no_tt) THEN
        -- Would need more parameters to create new TT
        RAISE EXCEPTION 'TT % does not exist', p_no_tt;
    END IF;
    
    -- Update reference with TT number
    UPDATE return_sales SET tt = p_no_tt WHERE no_retur = p_no_ref;
END;
$$;

-- 12. PROCEDURE sp_voucher (NO CHANGE - Already Compatible)
CREATE OR REPLACE PROCEDURE sp_voucher(
    p_no_voucher VARCHAR(15),
    p_no_ref VARCHAR(15)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if voucher exists
    IF NOT EXISTS (SELECT 1 FROM m_voucher WHERE no_voucher = p_no_voucher) THEN
        -- Would need more parameters to create new voucher
        RAISE EXCEPTION 'Voucher % does not exist', p_no_voucher;
    END IF;
    
    -- Update penerimaan_finance with voucher number
    UPDATE penerimaan_finance SET no_voucher = p_no_voucher WHERE no_penerimaan = p_no_ref;
END;
$$;

-- Note: Some procedures from original file are not recreated because:
-- 1. sp_merge_barang - Tables merge_barang and merge_barang_detail don't exist
-- 2. sp_opname - Tables opname and opname_detail don't exist
-- These would need to be redesigned if the functionality is required
