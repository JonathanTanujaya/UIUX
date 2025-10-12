import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius, components } from '../../../styles/designTokens';

// Icon placeholders (you can replace with actual icon library)
const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;
const FilterIcon = () => <span>⚙️</span>;

const MasterCustomersNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    kode_cust: '',
    nama_customer: '',
    alamat_customer: '',
    kota: '',
    telp: '',
    npwp: '',
    kode_sales: '',
    kode_area: '',
    top: '',
    limit_piutang: '',
  });

  // Dummy data akan otomatis terisi dari stubNetwork
  const [customers] = useState([]);
  const [loading] = useState(false);

  const itemsPerPage = 15;

  // Filter customers
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nama_customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.kode_cust?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.kota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission (stubbed)
    console.log('Submitting:', formData);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      kode_cust: '',
      nama_customer: '',
      alamat_customer: '',
      kota: '',
      telp: '',
      npwp: '',
      kode_sales: '',
      kode_area: '',
      top: '',
      limit_piutang: '',
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
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
          Master Customer
        </h1>
        <p style={{ fontSize: typography.fontSize.base, color: colors.gray[600], margin: 0 }}>
          Kelola data customer dan informasi pelanggan
        </p>
      </div>

      {/* Action Bar */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: spacing[3],
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari customer (nama, kode, kota)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: components.input.height,
                padding: `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[10]}`,
                paddingLeft: spacing[10],
                fontSize: typography.fontSize.sm,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: borderRadius.md,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary[600];
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.gray[300];
                e.target.style.boxShadow = 'none';
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: spacing[3],
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray[400],
              }}
            >
              <SearchIcon />
            </div>
          </div>

          {/* Filter Button */}
          <Button variant="secondary" icon={<FilterIcon />}>
            Filter
          </Button>

          {/* Add Button */}
          <Button icon={<PlusIcon />} onClick={() => setShowForm(true)}>
            Tambah Customer
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: typography.fontSize.sm,
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: colors.gray[50],
                  borderBottom: `2px solid ${colors.gray[200]}`,
                }}
              >
                <th style={tableHeaderStyle}>Kode</th>
                <th style={tableHeaderStyle}>Nama Customer</th>
                <th style={tableHeaderStyle}>Kota</th>
                <th style={tableHeaderStyle}>Telepon</th>
                <th style={tableHeaderStyle}>Sales</th>
                <th style={tableHeaderStyle}>TOP</th>
                <th style={tableHeaderStyle}>Limit Piutang</th>
                <th style={tableHeaderStyle}>Saldo</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    Loading data...
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    {searchTerm ? 'Tidak ada customer yang sesuai pencarian' : 'Belum ada data customer'}
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, index) => (
                  <tr
                    key={customer.kode_cust || index}
                    style={{
                      borderBottom: `1px solid ${colors.gray[200]}`,
                      transition: 'background-color 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.gray[50])}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
                        {customer.kode_cust}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>
                          {customer.nama_customer}
                        </div>
                        {customer.alamat_customer && (
                          <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>
                            {customer.alamat_customer}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={tableCellStyle}>{customer.kota}</td>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
                        {customer.telp}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{customer.kode_sales}</td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: colors.primary[50],
                          color: colors.primary[700],
                          borderRadius: borderRadius.base,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      >
                        {customer.top} hari
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', fontFamily: typography.fontFamily.mono }}>
                      {formatCurrency(customer.limit_piutang)}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', fontFamily: typography.fontFamily.mono }}>
                      <span style={{ color: customer.saldo_piutang > 0 ? colors.warning[600] : colors.gray[600] }}>
                        {formatCurrency(customer.saldo_piutang)}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
                        <button
                          style={actionButtonStyle}
                          onClick={() => {
                            setFormData(customer);
                            setShowForm(true);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button style={{ ...actionButtonStyle, color: colors.error[600] }}>
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing[4],
              borderTop: `1px solid ${colors.gray[200]}`,
            }}
          >
            <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} dari{' '}
              {filteredCustomers.length} customer
            </div>
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Form Modal (Simplified - will be shown when showForm=true) */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius.lg,
              padding: spacing[6],
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, marginBottom: spacing[4] }}>
              {formData.kode_cust ? 'Edit Customer' : 'Tambah Customer Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                <Input
                  label="Kode Customer"
                  name="kode_cust"
                  value={formData.kode_cust}
                  onChange={(e) => setFormData({ ...formData, kode_cust: e.target.value })}
                  required
                />
                <Input
                  label="Nama Customer"
                  name="nama_customer"
                  value={formData.nama_customer}
                  onChange={(e) => setFormData({ ...formData, nama_customer: e.target.value })}
                  required
                />
                <Input
                  label="Alamat"
                  name="alamat_customer"
                  value={formData.alamat_customer}
                  onChange={(e) => setFormData({ ...formData, alamat_customer: e.target.value })}
                  fullWidth
                  style={{ gridColumn: '1 / -1' }}
                />
                <Input
                  label="Kota"
                  name="kota"
                  value={formData.kota}
                  onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                />
                <Input
                  label="Telepon"
                  name="telp"
                  value={formData.telp}
                  onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                />
                <Input
                  label="NPWP"
                  name="npwp"
                  value={formData.npwp}
                  onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                />
                <Input
                  label="Kode Sales"
                  name="kode_sales"
                  value={formData.kode_sales}
                  onChange={(e) => setFormData({ ...formData, kode_sales: e.target.value })}
                />
                <Input
                  label="TOP (Hari)"
                  type="number"
                  name="top"
                  value={formData.top}
                  onChange={(e) => setFormData({ ...formData, top: e.target.value })}
                />
                <Input
                  label="Limit Piutang"
                  type="number"
                  name="limit_piutang"
                  value={formData.limit_piutang}
                  onChange={(e) => setFormData({ ...formData, limit_piutang: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[6], justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
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

const actionButtonStyle = {
  padding: spacing[2],
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray[600],
  borderRadius: borderRadius.base,
  transition: 'all 150ms',
};

export default MasterCustomersNew;
