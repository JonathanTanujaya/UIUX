import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Select } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../../styles/designTokens';
import { api } from '../../../services/api';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;
const XIcon = () => <span>✖️</span>;
const FilterIcon = () => <span>⚙️</span>;
const ExportIcon = () => <span>📥</span>;
const PackageIcon = () => <span>📦</span>;

const MasterSparepartNew = () => {
  const [spareparts, setSpareparts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, normal, low, out
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kode_kategori: '',
    stok: '',
    min_stok: '',
    harga_beli: '',
    harga_jual: '',
    satuan: 'pcs',
  });

  useEffect(() => {
    fetchSpareparts();
    fetchCategories();
  }, []);

  const fetchSpareparts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/spareparts');
      const data = response.data || [];
      setSpareparts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching spareparts:', error);
      setSpareparts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      console.log('Updating sparepart:', editingId, formData);
      setSpareparts(spareparts.map(sp => 
        sp.kode_barang === editingId 
          ? { ...sp, ...formData }
          : sp
      ));
    } else {
      console.log('Adding sparepart:', formData);
      setSpareparts([...spareparts, { ...formData }]);
    }
    
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (sparepart) => {
    setEditingId(sparepart.kode_barang);
    setFormData(sparepart);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (kodeBarang) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sparepart ini?')) {
      console.log('Deleting sparepart:', kodeBarang);
      setSpareparts(spareparts.filter(sp => sp.kode_barang !== kodeBarang));
    }
  };

  const resetForm = () => {
    setFormData({
      kode_barang: '',
      nama_barang: '',
      kode_kategori: '',
      stok: '',
      min_stok: '',
      harga_beli: '',
      harga_jual: '',
      satuan: 'pcs',
    });
    setEditingId(null);
  };

  const getStockStatus = (stok, minStok) => {
    if (stok <= 0) return { label: 'Out of Stock', color: colors.error[600], bg: colors.error[50] };
    if (stok <= minStok) return { label: 'Low Stock', color: colors.warning[700], bg: colors.warning[50] };
    return { label: 'Normal', color: colors.success[700], bg: colors.success[50] };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
  };

  const filteredSpareparts = spareparts.filter((sp) => {
    const matchSearch = 
      sp.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.kode_barang?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = !filterCategory || sp.kode_kategori === filterCategory;
    
    let matchStock = true;
    if (filterStock === 'out') matchStock = sp.stok <= 0;
    else if (filterStock === 'low') matchStock = sp.stok > 0 && sp.stok <= sp.min_stok;
    else if (filterStock === 'normal') matchStock = sp.stok > sp.min_stok;
    
    return matchSearch && matchCategory && matchStock;
  });

  // Calculate stats
  const totalItems = spareparts.length;
  const lowStockCount = spareparts.filter(sp => sp.stok > 0 && sp.stok <= sp.min_stok).length;
  const outOfStockCount = spareparts.filter(sp => sp.stok <= 0).length;
  const totalValue = spareparts.reduce((sum, sp) => sum + (sp.stok * sp.harga_beli || 0), 0);

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.gray[50], minHeight: '100vh' }}>
      
      {/* Action Bar */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button icon={<PlusIcon />} onClick={() => setShowForm(true)}>
            Tambah Sparepart
          </Button>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <Button variant="secondary" icon={<FilterIcon />} size="sm">Filter</Button>
            <Button variant="secondary" icon={<ExportIcon />} size="sm">Export</Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing[4], marginBottom: spacing[4] }}>
        <Card padding={spacing[4]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.lg, backgroundColor: colors.primary[100], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <PackageIcon />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>Total Items</div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
                {totalItems}
              </div>
            </div>
          </div>
        </Card>

        <Card padding={spacing[4]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.lg, backgroundColor: colors.warning[100], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>Low Stock</div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.warning[700] }}>
                {lowStockCount}
              </div>
            </div>
          </div>
        </Card>

        <Card padding={spacing[4]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.lg, backgroundColor: colors.error[100], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              ❌
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>Out of Stock</div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.error[600] }}>
                {outOfStockCount}
              </div>
            </div>
          </div>
        </Card>

        <Card padding={spacing[4]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.lg, backgroundColor: colors.success[100], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              💰
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>Total Value</div>
              <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.success[700] }}>
                {formatCurrency(totalValue)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: spacing[3] }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari sparepart (kode/nama)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
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

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              height: '40px',
              padding: `${spacing[2]} ${spacing[3]}`,
              fontSize: typography.fontSize.sm,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: borderRadius.md,
              outline: 'none',
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.kode_kategori} value={cat.kode_kategori}>
                {cat.nama_kategori}
              </option>
            ))}
          </select>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            style={{
              height: '40px',
              padding: `${spacing[2]} ${spacing[3]}`,
              fontSize: typography.fontSize.sm,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: borderRadius.md,
              outline: 'none',
            }}
          >
            <option value="all">Semua Stok</option>
            <option value="normal">Normal</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </Card>

      {/* Table - Scrollable */}
      <Card padding="0">
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: colors.gray[50], zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={tableHeaderStyle}>No</th>
                <th style={tableHeaderStyle}>Kode</th>
                <th style={tableHeaderStyle}>Nama Sparepart</th>
                <th style={tableHeaderStyle}>Kategori</th>
                <th style={tableHeaderStyle}>Stok</th>
                <th style={tableHeaderStyle}>Harga Beli</th>
                <th style={tableHeaderStyle}>Harga Jual</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    Loading data...
                  </td>
                </tr>
              ) : filteredSpareparts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    {searchTerm || filterCategory || filterStock !== 'all' 
                      ? 'Tidak ada sparepart yang sesuai filter' 
                      : 'Belum ada data sparepart'}
                  </td>
                </tr>
              ) : (
                filteredSpareparts.map((sp, index) => {
                  const stockStatus = getStockStatus(sp.stok, sp.min_stok);
                  return (
                    <tr 
                      key={sp.kode_barang || index} 
                      style={{ 
                        borderBottom: `1px solid ${colors.gray[200]}`,
                        backgroundColor: editingId === sp.kode_barang ? colors.primary[50] : 'transparent'
                      }}
                    >
                      <td style={{ ...tableCellStyle, width: '60px', textAlign: 'center' }}>
                        <span style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>{index + 1}</span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ 
                          fontFamily: typography.fontFamily.mono, 
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.primary[700],
                          backgroundColor: colors.primary[50],
                          padding: `${spacing[1]} ${spacing[2]}`,
                          borderRadius: borderRadius.base
                        }}>
                          {sp.kode_barang}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>
                          {sp.nama_barang}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                          {sp.kode_kategori}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                          <span style={{ fontWeight: typography.fontWeight.semibold }}>{sp.stok}</span>
                          <span style={{ 
                            fontSize: typography.fontSize.xs,
                            padding: `${spacing[1]} ${spacing[2]}`,
                            backgroundColor: stockStatus.bg,
                            color: stockStatus.color,
                            borderRadius: borderRadius.base,
                            fontWeight: typography.fontWeight.medium
                          }}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontSize: typography.fontSize.sm }}>{formatCurrency(sp.harga_beli)}</span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.success[700] }}>
                          {formatCurrency(sp.harga_jual)}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
                          <button 
                            style={actionButtonStyle} 
                            onClick={() => handleEdit(sp)}
                            title="Edit sparepart"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            style={{ ...actionButtonStyle, color: colors.error[600] }} 
                            onClick={() => handleDelete(sp.kode_barang)}
                            title="Hapus sparepart"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div style={{ 
          padding: spacing[3], 
          borderTop: `1px solid ${colors.gray[200]}`, 
          backgroundColor: colors.gray[50],
          fontSize: typography.fontSize.sm,
          color: colors.gray[600],
          textAlign: 'center'
        }}>
          Menampilkan <strong style={{ color: colors.gray[900] }}>{filteredSpareparts.length}</strong> dari <strong style={{ color: colors.gray[900] }}>{totalItems}</strong> sparepart
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: spacing[4] }} onClick={() => setShowForm(false)}>
          <div style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing[6], maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: spacing[5] }}>
              <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, margin: 0, marginBottom: spacing[1] }}>
                {editingId ? 'Edit Sparepart' : 'Tambah Sparepart Baru'}
              </h2>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], margin: 0 }}>
                {editingId ? 'Update informasi sparepart' : 'Isi form di bawah untuk menambahkan sparepart baru'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Section: Informasi Dasar */}
              <div style={{ marginBottom: spacing[5] }}>
                <h3 style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[700], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Informasi Dasar
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                  <Input
                    label="Kode Barang"
                    name="kode_barang"
                    value={formData.kode_barang}
                    onChange={(e) => setFormData({ ...formData, kode_barang: e.target.value })}
                    placeholder="BRG001"
                    required
                    disabled={!!editingId}
                  />
                  <Select
                    label="Kategori"
                    name="kode_kategori"
                    value={formData.kode_kategori}
                    onChange={(e) => setFormData({ ...formData, kode_kategori: e.target.value })}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.kode_kategori} value={cat.kode_kategori}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </Select>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Nama Sparepart"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                      placeholder="Masukkan nama sparepart..."
                      required
                      fullWidth
                    />
                  </div>
                  <Select
                    label="Satuan"
                    name="satuan"
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    required
                  >
                    <option value="pcs">Pcs</option>
                    <option value="box">Box</option>
                    <option value="set">Set</option>
                    <option value="unit">Unit</option>
                    <option value="pack">Pack</option>
                  </Select>
                </div>
              </div>

              {/* Section: Stok */}
              <div style={{ marginBottom: spacing[5] }}>
                <h3 style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[700], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Informasi Stok
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                  <Input
                    label="Stok Saat Ini"
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                    placeholder="0"
                    required
                    helperText="Jumlah stok tersedia"
                  />
                  <Input
                    label="Minimum Stok"
                    type="number"
                    name="min_stok"
                    value={formData.min_stok}
                    onChange={(e) => setFormData({ ...formData, min_stok: e.target.value })}
                    placeholder="0"
                    required
                    helperText="Batas minimum untuk peringatan"
                  />
                </div>
              </div>

              {/* Section: Harga */}
              <div style={{ marginBottom: spacing[6] }}>
                <h3 style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[700], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Informasi Harga
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                  <Input
                    label="Harga Beli"
                    type="number"
                    name="harga_beli"
                    value={formData.harga_beli}
                    onChange={(e) => setFormData({ ...formData, harga_beli: e.target.value })}
                    placeholder="0"
                    required
                    helperText="Harga pembelian dari supplier"
                  />
                  <Input
                    label="Harga Jual"
                    type="number"
                    name="harga_jual"
                    value={formData.harga_jual}
                    onChange={(e) => setFormData({ ...formData, harga_jual: e.target.value })}
                    placeholder="0"
                    required
                    helperText="Harga jual ke customer"
                  />
                </div>
                {formData.harga_beli && formData.harga_jual && (
                  <div style={{ 
                    marginTop: spacing[3], 
                    padding: spacing[3], 
                    backgroundColor: colors.primary[50], 
                    borderRadius: borderRadius.md,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[700] }}>Margin:</span>
                    <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.primary[700] }}>
                      {((parseFloat(formData.harga_jual) - parseFloat(formData.harga_beli)) / parseFloat(formData.harga_beli) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: colors.gray[200], marginBottom: spacing[5] }}></div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>
                  Batal
                </Button>
                <Button type="submit" icon={editingId ? <EditIcon /> : <PlusIcon />}>
                  {editingId ? 'Update Sparepart' : 'Simpan Sparepart'}
                </Button>
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
  fontSize: typography.fontSize.base,
};

export default MasterSparepartNew;
