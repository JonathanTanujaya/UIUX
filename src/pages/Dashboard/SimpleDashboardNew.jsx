import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { colors, spacing, typography, borderRadius } from '../../styles/designTokens';

// Icon placeholders
const TrendUpIcon = () => <span style={{ fontSize: '24px' }}>📈</span>;
const TrendDownIcon = () => <span style={{ fontSize: '24px' }}>📉</span>;
const UsersIcon = () => <span style={{ fontSize: '24px' }}>👥</span>;
const PackageIcon = () => <span style={{ fontSize: '24px' }}>📦</span>;
const DollarIcon = () => <span style={{ fontSize: '24px' }}>💰</span>;
const ShoppingCartIcon = () => <span style={{ fontSize: '24px' }}>🛒</span>;

const SimpleDashboardNew = () => {
  // Dummy statistics
  const stats = [
    {
      label: 'Total Penjualan Bulan Ini',
      value: 'Rp 1.250.000.000',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarIcon />,
      color: colors.success[600],
    },
    {
      label: 'Invoice Outstanding',
      value: 'Rp 350.000.000',
      change: '-8.2%',
      trend: 'down',
      icon: <ShoppingCartIcon />,
      color: colors.warning[600],
    },
    {
      label: 'Jumlah Customer',
      value: '247',
      change: '+15',
      trend: 'up',
      icon: <UsersIcon />,
      color: colors.primary[600],
    },
    {
      label: 'Produk Stok Rendah',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: <PackageIcon />,
      color: colors.error[600],
    },
  ];

  // Dummy recent transactions
  const recentInvoices = [
    { no: 'INV/24/00125', customer: 'PT Maju Jaya Group', date: '2024-01-15', amount: 25750000, status: 'Paid' },
    { no: 'INV/24/00124', customer: 'CV Sejahtera Indonesia', date: '2024-01-14', amount: 18500000, status: 'Pending' },
    { no: 'INV/24/00123', customer: 'UD Makmur Mandiri', date: '2024-01-14', amount: 32250000, status: 'Paid' },
    { no: 'INV/24/00122', customer: 'Toko Sukses Prima', date: '2024-01-13', amount: 15800000, status: 'Overdue' },
    { no: 'INV/24/00121', customer: 'PT Utama Group', date: '2024-01-13', amount: 42100000, status: 'Paid' },
  ];

  // Dummy low stock items
  const lowStockItems = [
    { kode: 'BRG00025', nama: 'Komponen A-124', stok: 8, stok_min: 10, satuan: 'PCS' },
    { kode: 'BRG00042', nama: 'Sparepart B-301', stok: 5, stok_min: 15, satuan: 'SET' },
    { kode: 'BRG00067', nama: 'Aksesoris C-189', stok: 12, stok_min: 20, satuan: 'PCS' },
    { kode: 'BRG00091', nama: 'Part D-456', stok: 3, stok_min: 10, satuan: 'BOX' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return { bg: colors.success[50], text: colors.success[700] };
      case 'Pending':
        return { bg: colors.warning[50], text: colors.warning[700] };
      case 'Overdue':
        return { bg: colors.error[50], text: colors.error[700] };
      default:
        return { bg: colors.gray[50], text: colors.gray[700] };
    }
  };

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.gray[50], minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: spacing[6] }}>
        <h1
          style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.gray[900],
            margin: 0,
            marginBottom: spacing[2],
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: typography.fontSize.base, color: colors.gray[600], margin: 0 }}>
          Overview dan ringkasan aktivitas bisnis hari ini
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: spacing[4],
          marginBottom: spacing[6],
        }}
      >
        {stats.map((stat, index) => (
          <Card key={index} padding={spacing[5]}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[600],
                    margin: 0,
                    marginBottom: spacing[2],
                  }}
                >
                  {stat.label}
                </p>
                <h2
                  style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.gray[900],
                    margin: 0,
                    marginBottom: spacing[2],
                  }}
                >
                  {stat.value}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                  {stat.trend === 'up' ? <TrendUpIcon /> : <TrendDownIcon />}
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: stat.trend === 'up' ? colors.success[600] : colors.error[600],
                    }}
                  >
                    {stat.change}
                  </span>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
                    vs bulan lalu
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: borderRadius.lg,
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing[4] }}>
        {/* Recent Invoices */}
        <Card padding="0">
          <CardHeader
            title="Invoice Terbaru"
            subtitle="5 invoice terakhir yang dibuat"
            style={{ padding: spacing[5], paddingBottom: spacing[4] }}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
              <thead>
                <tr style={{ backgroundColor: colors.gray[50], borderBottom: `1px solid ${colors.gray[200]}` }}>
                  <th style={tableHeaderStyle}>No. Invoice</th>
                  <th style={tableHeaderStyle}>Customer</th>
                  <th style={tableHeaderStyle}>Tanggal</th>
                  <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Jumlah</th>
                  <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: `1px solid ${colors.gray[200]}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.gray[50])}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
                        {invoice.no}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>
                        {invoice.customer}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{invoice.date}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', fontFamily: typography.fontFamily.mono }}>
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <span
                        style={{
                          padding: `${spacing[1]} ${spacing[3]}`,
                          backgroundColor: getStatusColor(invoice.status).bg,
                          color: getStatusColor(invoice.status).text,
                          borderRadius: borderRadius.full,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card padding="0">
          <CardHeader
            title="Stok Rendah"
            subtitle="Produk yang perlu restock"
            style={{ padding: spacing[5], paddingBottom: spacing[4] }}
          />
          <div style={{ padding: `0 ${spacing[5]} ${spacing[5]}` }}>
            {lowStockItems.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: spacing[3],
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.error[50],
                  border: `1px solid ${colors.error[200]}`,
                  marginBottom: spacing[3],
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[900],
                        marginBottom: spacing[1],
                      }}
                    >
                      {item.nama}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      Kode: {item.kode}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.error[600] }}>
                      {item.stok}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      / {item.stok_min} {item.satuan}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Style helpers
const tableHeaderStyle = {
  padding: spacing[3],
  textAlign: 'left',
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  color: colors.gray[700],
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableCellStyle = {
  padding: spacing[3],
  color: colors.gray[700],
};

export default SimpleDashboardNew;
