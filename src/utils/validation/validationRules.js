// Core validation framework with reusable rules and patterns
import * as yup from 'yup';

// Validation Constants
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^(\+62|62|0)[0-9]{9,13}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  ALPHA_ONLY: /^[a-zA-Z\s]+$/,
  NUMERIC_ONLY: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  BARCODE: /^[0-9]{8,13}$/,
  PRODUCT_CODE: /^[A-Z0-9]{3,10}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  PERCENTAGE: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
  DATE_FORMAT: /^\d{4}-\d{2}-\d{2}$/,
  TIME_FORMAT: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Field-level validation rules
export const VALIDATION_RULES = {
  required: fieldName => ({
    required: true,
    message: `${fieldName} wajib diisi`,
  }),

  email: () => ({
    pattern: VALIDATION_PATTERNS.EMAIL,
    message: 'Format email tidak valid',
  }),

  phone: () => ({
    pattern: VALIDATION_PATTERNS.PHONE,
    message: 'Format nomor telepon tidak valid (gunakan format Indonesia)',
  }),

  minLength: (min, fieldName) => ({
    minLength: min,
    message: `${fieldName} minimal ${min} karakter`,
  }),

  maxLength: (max, fieldName) => ({
    maxLength: max,
    message: `${fieldName} maksimal ${max} karakter`,
  }),

  minValue: (min, fieldName) => ({
    min: min,
    message: `${fieldName} minimal ${min}`,
  }),

  maxValue: (max, fieldName) => ({
    max: max,
    message: `${fieldName} maksimal ${max}`,
  }),

  numeric: fieldName => ({
    pattern: VALIDATION_PATTERNS.NUMERIC_ONLY,
    message: `${fieldName} harus berupa angka`,
  }),

  decimal: fieldName => ({
    pattern: VALIDATION_PATTERNS.DECIMAL,
    message: `${fieldName} harus berupa angka decimal valid`,
  }),

  currency: fieldName => ({
    pattern: VALIDATION_PATTERNS.CURRENCY,
    message: `${fieldName} harus berupa nilai mata uang valid`,
  }),

  percentage: fieldName => ({
    pattern: VALIDATION_PATTERNS.PERCENTAGE,
    message: `${fieldName} harus berupa persentase (0-100)`,
  }),

  alphanumeric: fieldName => ({
    pattern: VALIDATION_PATTERNS.ALPHANUMERIC,
    message: `${fieldName} hanya boleh mengandung huruf dan angka`,
  }),

  alphaOnly: fieldName => ({
    pattern: VALIDATION_PATTERNS.ALPHA_ONLY,
    message: `${fieldName} hanya boleh mengandung huruf`,
  }),

  productCode: fieldName => ({
    pattern: VALIDATION_PATTERNS.PRODUCT_CODE,
    message: `${fieldName} harus format kode produk valid (3-10 karakter alfanumerik)`,
  }),

  barcode: fieldName => ({
    pattern: VALIDATION_PATTERNS.BARCODE,
    message: `${fieldName} harus berupa barcode valid (8-13 digit)`,
  }),

  date: fieldName => ({
    pattern: VALIDATION_PATTERNS.DATE_FORMAT,
    message: `${fieldName} harus berupa tanggal valid (YYYY-MM-DD)`,
  }),

  positiveNumber: fieldName => ({
    min: 0,
    message: `${fieldName} harus berupa angka positif`,
  }),

  positiveInteger: fieldName => ({
    min: 1,
    message: `${fieldName} harus berupa angka positif minimal 1`,
  }),

  username: fieldName => ({
    pattern: VALIDATION_PATTERNS.USERNAME,
    message: `${fieldName} harus 3-20 karakter (huruf, angka, underscore)`,
  }),

  password: fieldName => ({
    pattern: VALIDATION_PATTERNS.PASSWORD,
    message: `${fieldName} harus minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol`,
  }),
};

// Yup Schema Generators
export const createYupSchema = fields => {
  const schemaFields = {};

  Object.entries(fields).forEach(([fieldName, rules]) => {
    let fieldSchema = yup.string();

    // Handle different field types
    if (rules.type === 'number') {
      fieldSchema = yup.number();
    } else if (rules.type === 'boolean') {
      fieldSchema = yup.boolean();
    } else if (rules.type === 'date') {
      fieldSchema = yup.date();
    } else if (rules.type === 'array') {
      fieldSchema = yup.array();
    }

    // Apply validation rules
    if (rules.required) {
      if (rules.type === 'string' || !rules.type) {
        fieldSchema = fieldSchema.required(rules.required.message || `${fieldName} wajib diisi`);
      } else if (rules.type === 'number') {
        fieldSchema = fieldSchema
          .required(rules.required.message || `${fieldName} wajib diisi`)
          .typeError(`${fieldName} harus berupa angka`);
      }
    } else {
      fieldSchema = fieldSchema.nullable().optional();
    }

    // String validations
    if (rules.minLength) {
      fieldSchema = fieldSchema.min(rules.minLength.value, rules.minLength.message);
    }
    if (rules.maxLength) {
      fieldSchema = fieldSchema.max(rules.maxLength.value, rules.maxLength.message);
    }
    if (rules.pattern) {
      fieldSchema = fieldSchema.matches(rules.pattern.regex, rules.pattern.message);
    }

    // Number validations
    if (rules.min !== undefined) {
      fieldSchema = fieldSchema.min(rules.min.value, rules.min.message);
    }
    if (rules.max !== undefined) {
      fieldSchema = fieldSchema.max(rules.max.value, rules.max.message);
    }

    // Custom validations
    if (rules.custom) {
      rules.custom.forEach(customRule => {
        fieldSchema = fieldSchema.test(customRule.name, customRule.message, customRule.test);
      });
    }

    schemaFields[fieldName] = fieldSchema;
  });

  return yup.object().shape(schemaFields);
};

// Common validation schemas for business entities
export const COMMON_SCHEMAS = {
  // Master Barang validation schema
  barang: createYupSchema({
    KodeDivisi: {
      type: 'string',
      required: { message: 'Kode Divisi wajib diisi' },
      minLength: { value: 2, message: 'Kode Divisi minimal 2 karakter' },
      maxLength: { value: 10, message: 'Kode Divisi maksimal 10 karakter' },
      pattern: {
        regex: VALIDATION_PATTERNS.ALPHANUMERIC,
        message: 'Kode Divisi hanya boleh huruf dan angka',
      },
    },
    KodeBarang: {
      type: 'string',
      required: { message: 'Kode Barang wajib diisi' },
      minLength: { value: 3, message: 'Kode Barang minimal 3 karakter' },
      maxLength: { value: 15, message: 'Kode Barang maksimal 15 karakter' },
      pattern: {
        regex: VALIDATION_PATTERNS.PRODUCT_CODE,
        message: 'Format kode barang tidak valid',
      },
    },
    NamaBarang: {
      type: 'string',
      required: { message: 'Nama Barang wajib diisi' },
      minLength: { value: 3, message: 'Nama Barang minimal 3 karakter' },
      maxLength: { value: 100, message: 'Nama Barang maksimal 100 karakter' },
    },
    KodeKategori: {
      type: 'string',
      required: { message: 'Kategori wajib dipilih' },
    },
    HargaList: {
      type: 'number',
      required: { message: 'Harga List wajib diisi' },
      min: { value: 0, message: 'Harga List harus positif' },
    },
    HargaJual: {
      type: 'number',
      required: { message: 'Harga Jual wajib diisi' },
      min: { value: 0, message: 'Harga Jual harus positif' },
    },
    StokMin: {
      type: 'number',
      min: { value: 0, message: 'Stok Minimum harus positif' },
    },
    Disc1: {
      type: 'number',
      min: { value: 0, message: 'Diskon tidak boleh negatif' },
      max: { value: 100, message: 'Diskon maksimal 100%' },
    },
    Disc2: {
      type: 'number',
      min: { value: 0, message: 'Diskon tidak boleh negatif' },
      max: { value: 100, message: 'Diskon maksimal 100%' },
    },
    Barcode: {
      type: 'string',
      pattern: { regex: VALIDATION_PATTERNS.BARCODE, message: 'Format barcode tidak valid' },
    },
  }),

  // Customer validation schema
  customer: createYupSchema({
    KodeCust: {
      type: 'string',
      required: { message: 'Kode Customer wajib diisi' },
      minLength: { value: 3, message: 'Kode Customer minimal 3 karakter' },
      maxLength: { value: 10, message: 'Kode Customer maksimal 10 karakter' },
    },
    NamaCust: {
      type: 'string',
      required: { message: 'Nama Customer wajib diisi' },
      minLength: { value: 3, message: 'Nama Customer minimal 3 karakter' },
      maxLength: { value: 100, message: 'Nama Customer maksimal 100 karakter' },
    },
    Alamat: {
      type: 'string',
      required: { message: 'Alamat wajib diisi' },
      maxLength: { value: 255, message: 'Alamat maksimal 255 karakter' },
    },
    NoTelp: {
      type: 'string',
      pattern: { regex: VALIDATION_PATTERNS.PHONE, message: 'Format nomor telepon tidak valid' },
    },
    Email: {
      type: 'string',
      pattern: { regex: VALIDATION_PATTERNS.EMAIL, message: 'Format email tidak valid' },
    },
  }),

  // User validation schema
  user: createYupSchema({
    username: {
      type: 'string',
      required: { message: 'Username wajib diisi' },
      minLength: { value: 3, message: 'Username minimal 3 karakter' },
      maxLength: { value: 20, message: 'Username maksimal 20 karakter' },
      pattern: {
        regex: VALIDATION_PATTERNS.USERNAME,
        message: 'Username hanya boleh huruf, angka, dan underscore',
      },
    },
    password: {
      type: 'string',
      required: { message: 'Password wajib diisi' },
      minLength: { value: 8, message: 'Password minimal 8 karakter' },
      pattern: {
        regex: VALIDATION_PATTERNS.PASSWORD,
        message: 'Password harus mengandung huruf besar, kecil, angka, dan simbol',
      },
    },
    email: {
      type: 'string',
      required: { message: 'Email wajib diisi' },
      pattern: { regex: VALIDATION_PATTERNS.EMAIL, message: 'Format email tidak valid' },
    },
    nama: {
      type: 'string',
      required: { message: 'Nama wajib diisi' },
      minLength: { value: 2, message: 'Nama minimal 2 karakter' },
      maxLength: { value: 100, message: 'Nama maksimal 100 karakter' },
    },
  }),

  // Transaction validation schema
  transaction: createYupSchema({
    tanggal: {
      type: 'date',
      required: { message: 'Tanggal transaksi wajib diisi' },
    },
    customer_id: {
      type: 'string',
      required: { message: 'Customer wajib dipilih' },
    },
    total: {
      type: 'number',
      required: { message: 'Total transaksi wajib diisi' },
      min: { value: 0, message: 'Total transaksi harus positif' },
    },
    items: {
      type: 'array',
      custom: [
        {
          name: 'minItems',
          message: 'Minimal harus ada 1 item',
          test: value => value && value.length > 0,
        },
      ],
    },
  }),
};

// Cross-field validation rules
export const CROSS_FIELD_VALIDATIONS = {
  // Validate that end date is after start date
  dateRange: (startField, endField) => ({
    name: 'dateRange',
    message: `${endField} harus setelah ${startField}`,
    test: function (value) {
      const startDate = this.parent[startField];
      const endDate = value;

      if (!startDate || !endDate) return true;
      return new Date(endDate) >= new Date(startDate);
    },
  }),

  // Validate that selling price is higher than cost price
  priceValidation: (costField, sellingField) => ({
    name: 'priceValidation',
    message: 'Harga jual harus lebih tinggi dari harga beli',
    test: function (value) {
      const costPrice = this.parent[costField];
      const sellingPrice = value;

      if (!costPrice || !sellingPrice) return true;
      return parseFloat(sellingPrice) >= parseFloat(costPrice);
    },
  }),

  // Validate password confirmation
  passwordConfirmation: passwordField => ({
    name: 'passwordConfirmation',
    message: 'Konfirmasi password tidak cocok',
    test: function (value) {
      const password = this.parent[passwordField];
      return value === password;
    },
  }),

  // Validate discount combinations
  discountValidation: (disc1Field, disc2Field) => ({
    name: 'discountValidation',
    message: 'Total diskon tidak boleh lebih dari 100%',
    test: function (value) {
      const disc1 = parseFloat(this.parent[disc1Field]) || 0;
      const disc2 = parseFloat(value) || 0;
      return disc1 + disc2 <= 100;
    },
  }),
};

// Async validation functions
export const ASYNC_VALIDATIONS = {
  // Check if code is unique
  checkUniqueCode: async (value, endpoint, excludeId = null) => {
    if (!value) return true;

    try {
      const params = new URLSearchParams({ code: value });
      if (excludeId) params.append('exclude_id', excludeId);

      const response = await fetch(`${endpoint}?${params}`);
      const result = await response.json();

      return !result.exists;
    } catch (error) {
      console.error('Async validation error:', error);
      return true; // Allow submission if validation fails
    }
  },

  // Check if email is unique
  checkUniqueEmail: async (value, endpoint, excludeId = null) => {
    if (!value) return true;

    try {
      const params = new URLSearchParams({ email: value });
      if (excludeId) params.append('exclude_id', excludeId);

      const response = await fetch(`${endpoint}?${params}`);
      const result = await response.json();

      return !result.exists;
    } catch (error) {
      console.error('Async validation error:', error);
      return true;
    }
  },

  // Check if username is available
  checkUsernameAvailability: async (value, endpoint, excludeId = null) => {
    if (!value) return true;

    try {
      const params = new URLSearchParams({ username: value });
      if (excludeId) params.append('exclude_id', excludeId);

      const response = await fetch(`${endpoint}?${params}`);
      const result = await response.json();

      return result.available;
    } catch (error) {
      console.error('Async validation error:', error);
      return true;
    }
  },
};

// Helper functions
export const validateField = (value, rules) => {
  const errors = [];

  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(rules.required.message || 'Field ini wajib diisi');
    return errors; // Return early if required field is empty
  }

  if (value && rules.pattern && !rules.pattern.regex.test(value)) {
    errors.push(rules.pattern.message || 'Format tidak valid');
  }

  if (value && rules.minLength && value.length < rules.minLength.value) {
    errors.push(rules.minLength.message || `Minimal ${rules.minLength.value} karakter`);
  }

  if (value && rules.maxLength && value.length > rules.maxLength.value) {
    errors.push(rules.maxLength.message || `Maksimal ${rules.maxLength.value} karakter`);
  }

  if (value !== undefined && rules.min !== undefined && parseFloat(value) < rules.min.value) {
    errors.push(rules.min.message || `Minimal ${rules.min.value}`);
  }

  if (value !== undefined && rules.max !== undefined && parseFloat(value) > rules.max.value) {
    errors.push(rules.max.message || `Maksimal ${rules.max.value}`);
  }

  return errors;
};

export const validateForm = (data, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([fieldName, rules]) => {
    const fieldErrors = validateField(data[fieldName], rules);
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors[0]; // Take first error
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  COMMON_SCHEMAS,
  CROSS_FIELD_VALIDATIONS,
  ASYNC_VALIDATIONS,
  createYupSchema,
  validateField,
  validateForm,
};
