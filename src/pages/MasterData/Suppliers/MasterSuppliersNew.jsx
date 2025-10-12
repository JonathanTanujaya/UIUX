import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius, components } from '../../../styles/designTokens';
import { api } from '../../../services/api';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;
const FilterIcon = () => <span>⚙️</span>;

const MasterSuppliersNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    kode_supplier: '',
    nama_supplier: '',
    alamat: '',
    kota: '',
    telp: '',
    npwp: '',
    top: '',
  });

  const itemsPerPage = 15;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers');
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.nama_supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.kode_supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.kota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      kode_supplier: '',
      nama_supplier: '',
      alamat: '',
      kota: '',
      telp: '',
      npwp: '',
      top: '',
    });
  };

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.gray[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: spacing[6] }}>
        <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.gray[900], margin: 0, marginBottom: spacing[2] }}>
          Master Supplier
        </h1>
        <p style={{ fontSize: typography.fontSize.base, color: colors.gray[600], margin: 0 }}>
          Kelola data supplier dan informasi vendor
        </p>
      </div>

      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: spacing[3], alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari supplier (nama, kode, kota)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: components.input.height,
                padding: `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[10]}`,
                fontSize: typography.fontSize.sm,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: borderRadius.md,
                outline: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: spacing[3], top: '50%', transform: 'translateY(-50%)', color: colors.gray[400] }}>
              <SearchIcon />
            </div>
          </div>
          <Button variant="secondary" icon={<FilterIcon />}>Filter</Button>
          <Button icon={<PlusIcon />} onClick={() => setShowForm(true)}>Tambah Supplier</Button>
        </div>
      </Card>

      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
            <thead>
              <tr style={{ backgroundColor: colors.gray[50], borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={tableHeaderStyle}>Kode</th>
                <th style={tableHeaderStyle}>Nama Supplier</th>
                <th style={tableHeaderStyle}>Kota</th>
                <th style={tableHeaderStyle}>Telepon</th>
                <th style={tableHeaderStyle}>NPWP</th>
                <th style={tableHeaderStyle}>TOP</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>Loading data...</td></tr>
              ) : paginatedSuppliers.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                  {searchTerm ? 'Tidak ada supplier yang sesuai pencarian' : 'Belum ada data supplier'}
                </td></tr>
              ) : (
                paginatedSuppliers.map((supplier, index) => (
                  <tr key={supplier.kode_supplier || index} style={{ borderBottom: `1px solid ${colors.gray[200]}` }}>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{supplier.kode_supplier}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>{supplier.nama_supplier}</div>
                        {supplier.alamat && <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>{supplier.alamat}</div>}
                      </div>
                    </td>
                    <td style={tableCellStyle}>{supplier.kota}</td>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{supplier.telp}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{supplier.npwp}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ padding: `${spacing[1]} ${spacing[2]}`, backgroundColor: colors.primary[50], color: colors.primary[700], borderRadius: borderRadius.base, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium }}>
                        {supplier.top} hari
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
                        <button style={actionButtonStyle} onClick={() => { setFormData(supplier); setShowForm(true); }}><EditIcon /></button>
                        <button style={{ ...actionButtonStyle, color: colors.error[600] }}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderTop: `1px solid ${colors.gray[200]}` }}>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} dari {filteredSuppliers.length} supplier
            </div>
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return <Button key={page} variant={currentPage === page ? 'primary' : 'secondary'} size="sm" onClick={() => setCurrentPage(page)}>{page}</Button>;
              })}
              <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing[6], maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, marginBottom: spacing[4] }}>
              {formData.kode_supplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                <Input label="Kode Supplier" name="kode_supplier" value={formData.kode_supplier} onChange={(e) => setFormData({ ...formData, kode_supplier: e.target.value })} required />
                <Input label="Nama Supplier" name="nama_supplier" value={formData.nama_supplier} onChange={(e) => setFormData({ ...formData, nama_supplier: e.target.value })} required />
                <Input label="Alamat" name="alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} fullWidth style={{ gridColumn: '1 / -1' }} />
                <Input label="Kota" name="kota" value={formData.kota} onChange={(e) => setFormData({ ...formData, kota: e.target.value })} />
                <Input label="Telepon" name="telp" value={formData.telp} onChange={(e) => setFormData({ ...formData, telp: e.target.value })} />
                <Input label="NPWP" name="npwp" value={formData.npwp} onChange={(e) => setFormData({ ...formData, npwp: e.target.value })} />
                <Input label="TOP (Hari)" type="number" name="top" value={formData.top} onChange={(e) => setFormData({ ...formData, top: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[6], justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default MasterSuppliersNew;
