// Main export file for comprehensive validation framework
// This file provides a centralized import point for all validation-related components and utilities

// Core validation utilities
export {
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  COMMON_SCHEMAS,
  CROSS_FIELD_VALIDATIONS,
  ASYNC_VALIDATIONS,
  createValidationSchema,
  mergeValidationRules,
  validateField,
  validateForm,
  sanitizeInput,
  formatValidationMessage,
} from './validationRules';

// Custom hooks for form management
export {
  useEnhancedForm,
  useFormField,
  useFormArray,
  useConditionalValidation,
  useFormStepper,
  useAsyncValidation,
  useFormPersistence,
  useFormAnalytics,
} from './formHooks';

// Error handling components and utilities
export {
  ERROR_TYPES,
  ERROR_SEVERITY,
  parseError,
  ErrorBoundary,
  ErrorBoundaryFallback,
  ErrorProvider,
  ErrorContext,
  InlineError,
  FieldError,
  ErrorList,
  SuccessFeedback,
  useGlobalErrorHandler,
} from './errorHandling';

// Enhanced form components
export {
  ValidatedForm,
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedAutocompleteField,
  ValidatedCheckboxGroup,
  ValidatedRadioGroup,
  ValidatedSwitch,
  ValidatedArrayField,
  FormSection,
  FormActions,
} from './formComponents';

// API error mapping utilities
export {
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
} from './apiErrorMapper';

// Internationalization utilities
export {
  formatValidationMessage,
  getFieldName,
  formatErrorMessage,
  formatSuccessMessage,
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatPercentage,
  getValidationRules,
} from '../locales/i18n';

// Re-export commonly used validation schemas for convenience
export { default as userSchema } from './schemas/userSchema';
export { default as barangSchema } from './schemas/barangSchema';
export { default as customerSchema } from './schemas/customerSchema';
export { default as transactionSchema } from './schemas/transactionSchema';

// Validation presets for common use cases
export const VALIDATION_PRESETS = {
  // Basic field validations
  required: {
    required: { value: true, message: 'This field is required' },
  },

  email: {
    required: { value: true, message: 'Email is required' },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email format',
    },
  },

  password: {
    required: { value: true, message: 'Password is required' },
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain uppercase, lowercase, number, and special character',
    },
  },

  phone: {
    pattern: {
      value: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      message: 'Invalid phone number format',
    },
  },

  currency: {
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Invalid currency format',
    },
    min: { value: 0, message: 'Amount must be positive' },
  },

  percentage: {
    min: { value: 0, message: 'Percentage cannot be negative' },
    max: { value: 100, message: 'Percentage cannot exceed 100' },
  },
};

// Quick validation setup functions
export const createQuickForm = (schema, defaultValues = {}) => {
  return {
    schema,
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  };
};

export const createBasicValidation = rules => {
  return { rules };
};

// Common validation combinations
export const VALIDATION_COMBINATIONS = {
  userRegistration: {
    username: [
      VALIDATION_PRESETS.required,
      { minLength: { value: 3, message: 'Username too short' } },
    ],
    email: [VALIDATION_PRESETS.email],
    password: [VALIDATION_PRESETS.password],
    confirmPassword: [
      VALIDATION_PRESETS.required,
      { validate: (value, { password }) => value === password || 'Passwords do not match' },
    ],
  },

  productForm: {
    name: [VALIDATION_PRESETS.required, { maxLength: { value: 100, message: 'Name too long' } }],
    price: [VALIDATION_PRESETS.required, VALIDATION_PRESETS.currency],
    category: [VALIDATION_PRESETS.required],
    description: [{ maxLength: { value: 500, message: 'Description too long' } }],
  },

  contactForm: {
    name: [VALIDATION_PRESETS.required],
    email: [VALIDATION_PRESETS.email],
    phone: [VALIDATION_PRESETS.phone],
    message: [
      VALIDATION_PRESETS.required,
      { minLength: { value: 10, message: 'Message too short' } },
    ],
  },
};

// Accessibility helpers
export const ACCESSIBILITY_PROPS = {
  required: {
    'aria-required': true,
    'aria-invalid': false,
  },

  error: {
    'aria-invalid': true,
    'aria-describedby': 'field-error',
  },

  success: {
    'aria-invalid': false,
    'aria-describedby': 'field-success',
  },
};

// Performance optimization utilities
export const PERFORMANCE_CONFIG = {
  debounceDelay: 300,
  throttleDelay: 100,
  maxAsyncValidationTime: 5000,
  cacheValidationResults: true,
  batchValidationUpdates: true,
};

// Validation framework configuration
export const VALIDATION_CONFIG = {
  defaultLanguage: 'id',
  supportedLanguages: ['id', 'en'],
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableAnalytics: true,
  enablePersistence: true,
  autoSave: true,
  autoSaveDelay: 2000,
};

// Framework initialization helper
export const initializeValidationFramework = (config = {}) => {
  const finalConfig = { ...VALIDATION_CONFIG, ...config };

  // Setup global error handling
  if (finalConfig.enableDebugMode) {
    console.log('Validation Framework initialized with config:', finalConfig);
  }

  // Initialize analytics if enabled
  if (finalConfig.enableAnalytics) {
    // Setup form analytics tracking
  }

  return finalConfig;
};

// Type definitions for TypeScript users
export const ValidationTypes = {
  // Field validation rule type
  ValidationRule: {
    required: 'boolean | { value: boolean, message: string }',
    minLength: '{ value: number, message: string }',
    maxLength: '{ value: number, message: string }',
    min: '{ value: number, message: string }',
    max: '{ value: number, message: string }',
    pattern: '{ value: RegExp, message: string }',
    validate: 'function | object',
  },

  // Form configuration type
  FormConfig: {
    schema: 'Yup.Schema | Zod.Schema',
    defaultValues: 'object',
    mode: '"onChange" | "onBlur" | "onSubmit"',
    reValidateMode: '"onChange" | "onBlur" | "onSubmit"',
  },

  // Error type
  ValidationError: {
    type: 'string',
    message: 'string',
    field: 'string',
    code: 'string | number',
  },
};

// Usage examples
export const USAGE_EXAMPLES = {
  basicForm: `
import { ValidatedForm, ValidatedTextField, FormActions } from '@/utils/validation';

const MyForm = () => (
  <ValidatedForm onSubmit={handleSubmit} schema={mySchema}>
    <ValidatedTextField 
      name="email" 
      label="Email" 
      rules={VALIDATION_PRESETS.email} 
    />
    <FormActions />
  </ValidatedForm>
);`,

  customValidation: `
import { useEnhancedForm, VALIDATION_RULES } from '@/utils/validation';

const MyComponent = () => {
  const { formMethods, isValid } = useEnhancedForm({
    schema: mySchema,
    defaultValues: { email: '' }
  });
  
  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};`,

  errorHandling: `
import { ErrorBoundary, useGlobalErrorHandler } from '@/utils/validation';

const App = () => {
  const { handleError } = useGlobalErrorHandler();
  
  return (
    <ErrorBoundary>
      <MyForm onError={handleError} />
    </ErrorBoundary>
  );
};`,
};

// Default export for the entire validation framework
export default {
  // Core utilities
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  COMMON_SCHEMAS,

  // Components
  ValidatedForm,
  ValidatedTextField,
  ErrorBoundary,

  // Hooks
  useEnhancedForm,
  useFormField,

  // Configuration
  VALIDATION_CONFIG,
  VALIDATION_PRESETS,

  // Helpers
  initializeValidationFramework,
  createQuickForm,
  formatValidationMessage,
};
