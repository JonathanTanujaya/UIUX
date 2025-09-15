// Enhanced BarangForm with comprehensive validation framework
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider, Chip, Alert } from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  MonetizationOn as PriceIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Import validation framework
import { COMMON_SCHEMAS, VALIDATION_RULES } from '../utils/validation/validationRules';
import { useEnhancedForm } from '../utils/validation/formHooks';
import { ErrorBoundary, useGlobalErrorHandler } from '../utils/validation/errorHandling';
import {
  ValidatedForm,
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedSwitch,
  FormSection,
  FormActions,
} from '../utils/validation/formComponents';

// Import API service
import { barangService } from '../config/apiService.js';

// Form schema for barang
const barangFormSchema = COMMON_SCHEMAS.barang;

// Default form values
const defaultValues = {
  KodeDivisi: '',
  KodeBarang: '',
  NamaBarang: '',
  KodeKategori: '',
  HargaList: 0,
  HargaJual: 0,
  HargaList2: 0,
  HargaJual2: 0,
  Satuan: '',
  Disc1: 0,
  Disc2: 0,
  merk: '',
  Barcode: '',
  status: true,
  Lokasi: '',
  StokMin: 0,
  Checklist: false,
};

// Satuan options
const satuanOptions = [
  { value: 'PCS', label: 'Pieces (PCS)' },
  { value: 'KG', label: 'Kilogram (KG)' },
  { value: 'LITER', label: 'Liter' },
  { value: 'METER', label: 'Meter' },
  { value: 'SET', label: 'Set' },
  { value: 'ROLL', label: 'Roll' },
  { value: 'PACK', label: 'Pack' },
  { value: 'BOX', label: 'Box' },
  { value: 'UNIT', label: 'Unit' },
];

const EnhancedBarangForm = ({ item, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [kategoris, setKategoris] = useState([]);
  const [divisis, setDivisis] = useState([]);
  const { handleError } = useGlobalErrorHandler();

  // Enhanced form with validation
  const { formMethods, isValid, isDirty, errors, reset, watch, setValue } = useEnhancedForm({
    schema: barangFormSchema,
    defaultValues: item || defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Watch specific fields for cross-field validation
  const watchedFields = watch(['HargaList', 'HargaJual', 'Disc1', 'Disc2']);

  useEffect(() => {
    // Load initial data
    loadKategoris();
    loadDivisis();

    if (item) {
      reset(item);
    }
  }, [item, reset]);

  // Auto-calculate prices based on discounts
  useEffect(() => {
    const [hargaList, hargaJual, disc1, disc2] = watchedFields;

    if (hargaList && disc1) {
      const calculatedPrice = hargaList - (hargaList * disc1) / 100;
      if (calculatedPrice !== hargaJual) {
        setValue('HargaJual', calculatedPrice, { shouldValidate: true });
      }
    }
  }, [watchedFields, setValue]);

  const loadKategoris = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/kategoris');
      const data = await response.json();
      setKategoris(data.map(kat => ({ value: kat.KodeKategori, label: kat.NamaKategori })));
    } catch (error) {
      console.error('Error loading kategoris:', error);
      // Fallback to dummy data
      setKategoris([
        { value: 'KAT001', label: 'Elektronik' },
        { value: 'KAT002', label: 'Pakaian' },
        { value: 'KAT003', label: 'Makanan' },
      ]);
    }
  };

  const loadDivisis = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/divisis');
      const data = await response.json();
      setDivisis(data.map(div => ({ value: div.KodeDivisi, label: div.NamaDivisi })));
    } catch (error) {
      console.error('Error loading divisis:', error);
      // Fallback to dummy data
      setDivisis([
        { value: 'DIV001', label: 'Retail' },
        { value: 'DIV002', label: 'Wholesale' },
        { value: 'DIV003', label: 'Online' },
      ]);
    }
  };

  const handleSubmit = async formData => {
    setLoading(true);

    try {
      let result;
      if (item) {
        // Update existing item
        result = await barangService.update(item.KodeDivisi, item.KodeBarang, formData);
      } else {
        // Create new item
        result = await barangService.create(formData);
      }

      if (result.success) {
        toast.success(result.message || 'Data barang berhasil disimpan');
        onSave();
      } else {
        toast.error(result.message || 'Gagal menyimpan data barang');
      }
    } catch (error) {
      handleError(error, {
        customMessage: 'Terjadi kesalahan saat menyimpan data barang',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset(item || defaultValues);
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <ErrorBoundary>
      <ValidatedForm
        onSubmit={handleSubmit}
        schema={barangFormSchema}
        defaultValues={item || defaultValues}
        formMethods={formMethods}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {item ? 'Edit Barang' : 'Tambah Barang'}
          </Typography>

          {/* Display form status */}
          {isDirty && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Ada perubahan yang belum disimpan
            </Alert>
          )}

          {/* Basic Information Section */}
          <FormSection title="Informasi Dasar" subtitle="Data identitas barang" required>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ValidatedSelectField
                  name="KodeDivisi"
                  label="Divisi"
                  options={divisis}
                  rules={VALIDATION_RULES.required}
                  helperText="Pilih divisi untuk barang ini"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="KodeBarang"
                  label="Kode Barang"
                  rules={{
                    ...VALIDATION_RULES.required,
                    ...VALIDATION_RULES.alphanumeric,
                  }}
                  placeholder="Masukkan kode barang"
                  tooltip="Kode unik untuk identifikasi barang"
                />
              </Grid>

              <Grid item xs={12}>
                <ValidatedTextField
                  name="NamaBarang"
                  label="Nama Barang"
                  rules={{
                    ...VALIDATION_RULES.required,
                    maxLength: { value: 100, message: 'Nama barang maksimal 100 karakter' },
                  }}
                  placeholder="Masukkan nama barang"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedSelectField
                  name="KodeKategori"
                  label="Kategori"
                  options={kategoris}
                  helperText="Pilih kategori barang"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedSelectField
                  name="Satuan"
                  label="Satuan"
                  options={satuanOptions}
                  rules={VALIDATION_RULES.required}
                  helperText="Satuan unit barang"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField name="merk" label="Merk" placeholder="Merk/Brand barang" />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="Barcode"
                  label="Barcode"
                  rules={VALIDATION_RULES.alphanumeric}
                  placeholder="Kode barcode"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Pricing Section */}
          <FormSection title="Informasi Harga" subtitle="Pengaturan harga dan diskon" required>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="HargaList"
                  label="Harga List"
                  type="number"
                  rules={{
                    ...VALIDATION_RULES.required,
                    ...VALIDATION_RULES.positiveNumber,
                  }}
                  prefix="Rp"
                  formatValue={formatCurrency}
                  parseValue={value => parseFloat(value) || 0}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="HargaJual"
                  label="Harga Jual"
                  type="number"
                  rules={{
                    ...VALIDATION_RULES.required,
                    ...VALIDATION_RULES.positiveNumber,
                  }}
                  prefix="Rp"
                  formatValue={formatCurrency}
                  parseValue={value => parseFloat(value) || 0}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="HargaList2"
                  label="Harga List 2"
                  type="number"
                  rules={VALIDATION_RULES.positiveNumber}
                  prefix="Rp"
                  formatValue={formatCurrency}
                  parseValue={value => parseFloat(value) || 0}
                  helperText="Harga list alternatif (opsional)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="HargaJual2"
                  label="Harga Jual 2"
                  type="number"
                  rules={VALIDATION_RULES.positiveNumber}
                  prefix="Rp"
                  formatValue={formatCurrency}
                  parseValue={value => parseFloat(value) || 0}
                  helperText="Harga jual alternatif (opsional)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="Disc1"
                  label="Diskon 1"
                  type="number"
                  rules={{
                    min: { value: 0, message: 'Diskon tidak boleh negatif' },
                    max: { value: 100, message: 'Diskon maksimal 100%' },
                  }}
                  suffix="%"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="Disc2"
                  label="Diskon 2"
                  type="number"
                  rules={{
                    min: { value: 0, message: 'Diskon tidak boleh negatif' },
                    max: { value: 100, message: 'Diskon maksimal 100%' },
                  }}
                  suffix="%"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Inventory Section */}
          <FormSection title="Informasi Stok" subtitle="Pengaturan stok dan lokasi">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="Lokasi"
                  label="Lokasi"
                  placeholder="Lokasi penyimpanan barang"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="StokMin"
                  label="Stok Minimum"
                  type="number"
                  rules={VALIDATION_RULES.positiveNumber}
                  helperText="Stok minimum untuk peringatan"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedSwitch
                  name="status"
                  label="Status Aktif"
                  helperText="Aktifkan barang untuk transaksi"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedSwitch
                  name="Checklist"
                  label="Checklist"
                  helperText="Tandai untuk keperluan checklist"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Display calculated totals */}
          {watchedFields[0] > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ringkasan Harga
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Harga List:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(watchedFields[0])}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Harga Jual:</Typography>
                  <Typography variant="h6" color="secondary">
                    {formatCurrency(watchedFields[1])}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Form Actions */}
          <FormActions
            submitText={item ? 'Update Barang' : 'Simpan Barang'}
            cancelText="Batal"
            resetText="Reset"
            onCancel={onCancel}
            onReset={handleReset}
            loading={loading}
            disabled={!isValid}
            submitProps={{
              startIcon: <InventoryIcon />,
            }}
          />
        </Box>
      </ValidatedForm>
    </ErrorBoundary>
  );
};

export default EnhancedBarangForm;
