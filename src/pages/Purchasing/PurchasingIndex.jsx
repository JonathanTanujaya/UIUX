import React from 'react';
import { Link } from 'react-router-dom';

export default function PurchasingIndex() {
  return (
    <div className="purchasing-index">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Link to="/transactions/purchasing/form" className="tile-action">
          <div className="tile-head">+ Faktur Pembelian Baru</div>
          <div className="tile-desc">Buat faktur / GR baru dengan interface modern</div>
        </Link>
        <Link to="/transactions/purchasing/list" className="tile-action">
          <div className="tile-head">📋 Daftar Pembelian</div>
          <div className="tile-desc">Lihat dan kelola semua transaksi</div>
        </Link>
        <div className="tile-action disabled">
          <div className="tile-head">📊 Laporan</div>
          <div className="tile-desc">(Coming soon)</div>
        </div>
      </div>
    </div>
  );
}
