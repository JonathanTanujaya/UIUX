// API error mapper for server-side validation integration
import { parseError, ERROR_TYPES, ERROR_SEVERITY } from './errorHandling';
import { formatValidationMessage, formatErrorMessage, getFieldName } from '../locales/i18n';

// Laravel validation error response structure
const LARAVEL_ERROR_PATTERNS = {
  VALIDATION: /validation/i,
  UNIQUE: /unique/i,
  EXISTS: /exists/i,
  REQUIRED: /required/i,
  EMAIL: /email/i,
  NUMERIC: /numeric/i,
  MIN: /min:/i,
  MAX: /max:/i,
  BETWEEN: /between:/i,
  DATE: /date/i,
  AFTER: /after:/i,
  BEFORE: /before:/i,
};

// Common Laravel validation rules mapping
const LARAVEL_VALIDATION_MAPPING = {
  required: 'required',
  email: 'email',
  numeric: 'numeric',
  integer: 'integer',
  min: 'min',
  max: 'max',
  between: 'between',
  unique: 'unique',
  exists: 'exists',
  confirmed: 'match',
  date: 'date',
  date_format: 'date',
  after: 'dateAfter',
  before: 'dateBefore',
  alpha: 'pattern',
  alpha_num: 'alphanumeric',
  regex: 'pattern',
  url: 'url',
  file: 'fileType',
  mimes: 'fileType',
  max_file_size: 'fileSize',
};

// Field name mapping for different contexts
const FIELD_NAME_MAPPING = {
  // Barang fields
  kode_divisi: 'barang.kodeDivisi',
  kode_barang: 'barang.kodeBarang',
  nama_barang: 'barang.namaBarang',
  kode_kategori: 'barang.kodeKategori',
  harga_list: 'barang.hargaList',
  harga_jual: 'barang.hargaJual',
  harga_list2: 'barang.hargaList2',
  harga_jual2: 'barang.hargaJual2',
  disc1: 'barang.disc1',
  disc2: 'barang.disc2',
  stok_min: 'barang.stokMin',

  // Customer fields
  kode_customer: 'customer.kodeCustomer',
  nama_customer: 'customer.namaCustomer',
  contact_person: 'customer.contact',
  limit_kredit: 'customer.limit',
  term_pembayaran: 'customer.term',

  // User fields
  full_name: 'user.fullName',
  confirm_password: 'user.confirmPassword',
  last_login: 'user.lastLogin',
  created_at: 'user.createdAt',
  updated_at: 'user.updatedAt',

  // Transaction fields
  nomor_invoice: 'transaction.nomorInvoice',
  tanggal_invoice: 'transaction.tanggal',
  sales_person: 'transaction.salesPerson',
  jatuh_tempo: 'transaction.jatuhTempo',
  sub_total: 'transaction.subTotal',
  total_amount: 'transaction.total',
};

// Parse Laravel validation error message
export const parseLaravelValidation = (rule, field, value = null, parameters = []) => {
  const fieldKey = FIELD_NAME_MAPPING[field] || field;
  const fieldName = getFieldName(fieldKey);

  switch (rule) {
    case 'required':
      return formatValidationMessage('required', fieldKey);

    case 'email':
      return formatValidationMessage('email', fieldKey);

    case 'numeric':
      return formatValidationMessage('numeric', fieldKey);

    case 'integer':
      return formatValidationMessage('integer', fieldKey);

    case 'min':
      const minValue = parameters[0];
      return formatValidationMessage('min', fieldKey, { min: minValue });

    case 'max':
      const maxValue = parameters[0];
      return formatValidationMessage('max', fieldKey, { max: maxValue });

    case 'between':
      const [minVal, maxVal] = parameters;
      return formatValidationMessage('between', fieldKey, { min: minVal, max: maxVal });

    case 'unique':
      return formatValidationMessage('unique', fieldKey);

    case 'exists':
      return formatValidationMessage('exists', fieldKey);

    case 'confirmed':
      return formatValidationMessage('passwordMatch', fieldKey);

    case 'date':
      return formatValidationMessage('date', fieldKey);

    case 'after':
      const afterDate = parameters[0];
      return formatValidationMessage('dateAfter', fieldKey, { date: afterDate });

    case 'before':
      const beforeDate = parameters[0];
      return formatValidationMessage('dateBefore', fieldKey, { date: beforeDate });

    case 'alpha_num':
      return formatValidationMessage('alphanumeric', fieldKey);

    case 'url':
      return formatValidationMessage('url', fieldKey);

    case 'mimes':
      const allowedTypes = parameters.join(', ');
      return formatValidationMessage('fileType', fieldKey, { types: allowedTypes });

    case 'max_file_size':
      const maxSize = parameters[0];
      return formatValidationMessage('fileSize', fieldKey, { size: maxSize });

    default:
      return `${fieldName}: ${rule} validation failed`;
  }
};

// Map Laravel validation errors to client format
export const mapLaravelValidationErrors = laravelErrors => {
  const mappedErrors = {};

  if (!laravelErrors || typeof laravelErrors !== 'object') {
    return mappedErrors;
  }

  Object.entries(laravelErrors).forEach(([field, messages]) => {
    const messageArray = Array.isArray(messages) ? messages : [messages];

    // Map field name from snake_case to camelCase
    const mappedField = field.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

    // Parse each validation message
    const parsedMessages = messageArray.map(message => {
      // Try to extract rule from message
      const rule = extractValidationRule(message);

      if (rule) {
        return parseLaravelValidation(rule, field);
      }

      // If can't parse rule, return original message but translate field name
      const fieldKey = FIELD_NAME_MAPPING[field] || field;
      const fieldName = getFieldName(fieldKey);

      return message.replace(field, fieldName);
    });

    mappedErrors[mappedField] = parsedMessages[0]; // Take first message
  });

  return mappedErrors;
};

// Extract validation rule from Laravel error message
const extractValidationRule = message => {
  const lowerMessage = message.toLowerCase();

  if (LARAVEL_ERROR_PATTERNS.REQUIRED.test(lowerMessage)) return 'required';
  if (LARAVEL_ERROR_PATTERNS.EMAIL.test(lowerMessage)) return 'email';
  if (LARAVEL_ERROR_PATTERNS.NUMERIC.test(lowerMessage)) return 'numeric';
  if (LARAVEL_ERROR_PATTERNS.UNIQUE.test(lowerMessage)) return 'unique';
  if (LARAVEL_ERROR_PATTERNS.EXISTS.test(lowerMessage)) return 'exists';
  if (LARAVEL_ERROR_PATTERNS.MIN.test(lowerMessage)) return 'min';
  if (LARAVEL_ERROR_PATTERNS.MAX.test(lowerMessage)) return 'max';
  if (LARAVEL_ERROR_PATTERNS.BETWEEN.test(lowerMessage)) return 'between';
  if (LARAVEL_ERROR_PATTERNS.DATE.test(lowerMessage)) return 'date';
  if (LARAVEL_ERROR_PATTERNS.AFTER.test(lowerMessage)) return 'after';
  if (LARAVEL_ERROR_PATTERNS.BEFORE.test(lowerMessage)) return 'before';

  return null;
};

// Enhanced API error parser
export const parseApiError = error => {
  const baseError = parseError(error);

  // Handle Laravel validation errors specifically
  if (error.response?.status === 422 && error.response?.data?.errors) {
    const validationErrors = mapLaravelValidationErrors(error.response.data.errors);

    return {
      ...baseError,
      type: ERROR_TYPES.VALIDATION,
      severity: ERROR_SEVERITY.MEDIUM,
      validationErrors,
      details: Object.entries(validationErrors).map(([field, message]) => ({
        field,
        messages: [message],
      })),
    };
  }

  // Handle other API error formats
  if (error.response?.data) {
    const data = error.response.data;

    // Handle custom error format
    if (data.error_type && data.error_message) {
      return {
        ...baseError,
        type: data.error_type,
        message: data.error_message,
        details: data.error_details || [],
      };
    }

    // Handle simple message format
    if (data.message) {
      return {
        ...baseError,
        message: data.message,
      };
    }
  }

  return baseError;
};

// Convert client validation errors to server format
export const convertToServerValidation = clientErrors => {
  const serverErrors = {};

  Object.entries(clientErrors).forEach(([field, message]) => {
    // Convert camelCase to snake_case
    const serverField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
    serverErrors[serverField] = [message];
  });

  return serverErrors;
};

// API response interceptor for automatic error handling
export const createApiErrorInterceptor = (axiosInstance, errorHandler) => {
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const parsedError = parseApiError(error);

      // Call global error handler if provided
      if (errorHandler) {
        errorHandler(parsedError);
      }

      // Modify error object for consistency
      error.parsedError = parsedError;

      return Promise.reject(error);
    }
  );
};

// Form submission error handler
export const handleFormSubmissionError = (error, setError) => {
  const parsedError = parseApiError(error);

  // Set form field errors if validation errors exist
  if (parsedError.validationErrors) {
    Object.entries(parsedError.validationErrors).forEach(([field, message]) => {
      setError(field, {
        type: 'server',
        message: message,
      });
    });
  }

  return parsedError;
};

// Success response parser
export const parseApiSuccess = response => {
  const data = response.data;

  return {
    success: true,
    message: data.message || 'Operation completed successfully',
    data: data.data || data,
    meta: data.meta || null,
  };
};

// API request wrapper with error handling
export const apiRequest = async (requestFn, options = {}) => {
  try {
    const response = await requestFn();
    return parseApiSuccess(response);
  } catch (error) {
    const parsedError = parseApiError(error);

    // Handle specific error types
    if (options.onValidationError && parsedError.type === ERROR_TYPES.VALIDATION) {
      options.onValidationError(parsedError.validationErrors);
    }

    if (options.onNetworkError && parsedError.type === ERROR_TYPES.NETWORK) {
      options.onNetworkError(parsedError);
    }

    if (options.onServerError && parsedError.type === ERROR_TYPES.SERVER) {
      options.onServerError(parsedError);
    }

    throw parsedError;
  }
};

// Retry mechanism for API requests
export const createRetryableRequest = (requestFn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn(...args);
      } catch (error) {
        lastError = error;

        const parsedError = parseApiError(error);

        // Don't retry validation errors or client errors
        if (
          parsedError.type === ERROR_TYPES.VALIDATION ||
          parsedError.type === ERROR_TYPES.CLIENT ||
          parsedError.type === ERROR_TYPES.AUTHORIZATION
        ) {
          throw parsedError;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw parseApiError(lastError);
  };
};

// Batch validation error processor
export const processBatchValidationErrors = (errors, itemIdentifier = 'id') => {
  const processedErrors = {};

  Object.entries(errors).forEach(([key, messages]) => {
    // Parse batch error key format: "items.0.field" or "batch.1.field"
    const match = key.match(/^(items|batch)\.(\d+)\.(.+)$/);

    if (match) {
      const [, , index, field] = match;
      const itemId = `${itemIdentifier}_${index}`;

      if (!processedErrors[itemId]) {
        processedErrors[itemId] = {};
      }

      const mappedField = field.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      const fieldKey = FIELD_NAME_MAPPING[field] || field;
      const translatedMessages = Array.isArray(messages)
        ? messages.map(msg => translateErrorMessage(msg, fieldKey))
        : [translateErrorMessage(messages, fieldKey)];

      processedErrors[itemId][mappedField] = translatedMessages[0];
    }
  });

  return processedErrors;
};

// Translate error message using field context
const translateErrorMessage = (message, fieldKey) => {
  const fieldName = getFieldName(fieldKey);

  // Replace field references in the message
  return message.replace(/\b\w+\b/g, word => {
    if (FIELD_NAME_MAPPING[word]) {
      return getFieldName(FIELD_NAME_MAPPING[word]);
    }
    return word;
  });
};

export default {
  parseLaravelValidation,
  mapLaravelValidationErrors,
  parseApiError,
  convertToServerValidation,
  createApiErrorInterceptor,
  handleFormSubmissionError,
  parseApiSuccess,
  apiRequest,
  createRetryableRequest,
  processBatchValidationErrors,
};
