import React from 'react';
import { useLocation } from 'react-router-dom';

function PageHeader({ title, subtitle, actions }) {
  const location = useLocation();

  // Auto-generate title based on path if not provided
  const getAutoTitle = () => {
    const pathMap = {
      '/transactions/purchasing': 'Transaksi Pembelian',
      '/transactions/purchasing/form': 'Form Pembelian Baru',
      '/transactions/purchasing/list': 'Daftar Pembelian',
      '/master/categories': 'Master Kategori',
      '/master/customer': 'Master Customer',
      '/master/supplier': 'Master Supplier',
      '/master/barang': 'Master Barang',
      '/master/sales': 'Master Sales',
      '/dashboard': 'Dashboard',
    };

    return pathMap[location.pathname] || title || 'Halaman';
  };

  const getAutoSubtitle = () => {
    const subtitleMap = {
      '/transactions/purchasing': 'Kelola transaksi pembelian dan penerimaan barang',
      '/transactions/purchasing/form':
        'Buat faktur pembelian baru dengan interface yang mudah digunakan',
      '/transactions/purchasing/list':
        'Lihat dan kelola semua transaksi pembelian yang telah dibuat',
      '/master/categories': 'Kelola kategori produk',
      '/master/customer': 'Kelola data customer',
      '/master/supplier': 'Kelola data supplier',
      '/master/barang': 'Kelola data barang',
      '/master/sales': 'Kelola data sales',
      '/dashboard': 'Ringkasan aktivitas dan statistik',
    };

    return subtitle || subtitleMap[location.pathname] || '';
  };

  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-header-title">{title || getAutoTitle()}</h1>
          {(subtitle || getAutoSubtitle()) && (
            <p className="page-header-subtitle">{subtitle || getAutoSubtitle()}</p>
          )}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
