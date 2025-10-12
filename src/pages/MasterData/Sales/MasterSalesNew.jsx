import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Select } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius, components } from '../../../styles/designTokens';
import { api } from '../../../services/api';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;
const FilterIcon = () => <span>⚙️</span>;
const UserIcon = () => <span>👤</span>;

const MasterSalesNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    kode_sales: '',
    nama: '',
    alamat: '',
    kota: '',
    telp: '',
    komisi: '',
    kode_divisi: '',
    status: 'aktif',
  });

  const itemsPerPage = 15;

  useEffect(() => {
    fetchSales();
    fetchDivisions();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sales');
      setSales(response.data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await api.get('/divisions');
      setDivisions(response.data || []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const filteredSales = sales.filter(
    (s) =>
      s.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kode_sales?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    if (status === 'aktif') return { bg: colors.success[50], text: colors.success[700] };
    return { bg: colors.gray[100], text: colors.gray[600] };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      kode_sales: '',
      nama: '',
      alamat: '',
      kota: '',
      telp: '',
      komisi: '',
      kode_divisi: '',
      status: 'aktif',
    });
  };

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.gray[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: spacing[6] }}>
        <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.gray[900], margin: 0, marginBottom: spacing[2] }}>
          Master Sales
        </h1>
        <p style={{ fontSize: typography.fontSize.base, color: colors.gray[600], margin: 0 }}>
          Kelola data sales dan informasi komisi
        </p>
      </div>

      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: spacing[3], alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari sales (nama, kode, kota)..."
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
          <Button icon={<PlusIcon />} onClick={() => setShowForm(true)}>Tambah Sales</Button>
        </div>
      </Card>

      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
            <thead>
              <tr style={{ backgroundColor: colors.gray[50], borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={tableHeaderStyle}>Kode</th>
                <th style={tableHeaderStyle}>Nama Sales</th>
                <th style={tableHeaderStyle}>Kota</th>
                <th style={tableHeaderStyle}>Telepon</th>
                <th style={tableHeaderStyle}>Divisi</th>
                <th style={tableHeaderStyle}>Komisi</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>Loading data...</td></tr>
              ) : paginatedSales.length === 0 ? (
                <tr><td colSpan="8" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                  {searchTerm ? 'Tidak ada sales yang sesuai pencarian' : 'Belum ada data sales'}
                </td></tr>
              ) : (
                paginatedSales.map((s, index) => {
                  const statusColors = getStatusColor(s.status);
                  return (
                    <tr key={s.kode_sales || index} style={{ borderBottom: `1px solid ${colors.gray[200]}` }}>
                      <td style={tableCellStyle}>
                        <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{s.kode_sales}</span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary[100], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary[700] }}>
                            <UserIcon />
                          </div>
                          <div>
                            <div style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>{s.nama}</div>
                            {s.alamat && <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>{s.alamat}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>{s.kota}</td>
                      <td style={tableCellStyle}>
                        <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{s.telp}</span>
                      </td>
                      <td style={tableCellStyle}>{s.kode_divisi}</td>
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: typography.fontWeight.medium, color: colors.success[700] }}>{s.komisi}%</span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ padding: `${spacing[1]} ${spacing[2]}`, backgroundColor: statusColors.bg, color: statusColors.text, borderRadius: borderRadius.base, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, textTransform: 'capitalize' }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
                          <button style={actionButtonStyle} onClick={() => { setFormData(s); setShowForm(true); }}><EditIcon /></button>
                          <button style={{ ...actionButtonStyle, color: colors.error[600] }}><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderTop: `1px solid ${colors.gray[200]}` }}>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSales.length)} dari {filteredSales.length} sales
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
              {formData.kode_sales ? 'Edit Sales' : 'Tambah Sales Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                <Input label="Kode Sales" name="kode_sales" value={formData.kode_sales} onChange={(e) => setFormData({ ...formData, kode_sales: e.target.value })} required />
                <Input label="Nama Sales" name="nama" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
                <Input label="Alamat" name="alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} fullWidth style={{ gridColumn: '1 / -1' }} />
                <Input label="Kota" name="kota" value={formData.kota} onChange={(e) => setFormData({ ...formData, kota: e.target.value })} />
                <Input label="Telepon" name="telp" value={formData.telp} onChange={(e) => setFormData({ ...formData, telp: e.target.value })} />
                <Select label="Divisi" name="kode_divisi" value={formData.kode_divisi} onChange={(e) => setFormData({ ...formData, kode_divisi: e.target.value })} required>
                  <option value="">Pilih Divisi</option>
                  {divisions.map((div) => (
                    <option key={div.kode_divisi} value={div.kode_divisi}>{div.nama_divisi}</option>
                  ))}
                </Select>
                <Input label="Komisi (%)" type="number" step="0.01" name="komisi" value={formData.komisi} onChange={(e) => setFormData({ ...formData, komisi: e.target.value })} />
                <Select label="Status" name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </Select>
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

export default MasterSalesNew;
