# Comprehensive Form Validation & Error Handling System

## Overview

This document provides complete documentation for the enterprise-grade form validation and error handling system implemented for the Laravel-React application. The system provides unified validation across the entire application with real-time feedback, internationalization support, and accessibility compliance.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Components](#components)
7. [Hooks](#hooks)
8. [Validation Rules](#validation-rules)
9. [Error Handling](#error-handling)
10. [Internationalization](#internationalization)
11. [Examples](#examples)
12. [Best Practices](#best-practices)
13. [Performance](#performance)
14. [Accessibility](#accessibility)
15. [Troubleshooting](#troubleshooting)

## Features

### ✅ Core Features

- **Unified Validation Framework**: Consistent validation across all forms
- **Real-time Validation**: Instant feedback without performance impact
- **Cross-field Dependencies**: Validation based on other field values
- **Async Validation**: Uniqueness checks and server validation
- **Debounced Validation**: Performance-optimized input validation
- **Error Boundaries**: Graceful error handling and recovery

### ✅ UI/UX Features

- **Contextual Error Messages**: User-friendly, actionable error messages
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility Compliance**: WCAG 2.1 AA compliant
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions

### ✅ Developer Features

- **TypeScript Support**: Full type safety (optional)
- **React Hook Form Integration**: Optimized form performance
- **Yup/Zod Schema Support**: Flexible validation schema definition
- **i18n Support**: Multi-language error messages
- **Server Integration**: Laravel validation error mapping
- **Development Tools**: Debug mode and validation analytics

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Forms (BarangForm, CustomerForm, etc.)                    │
├─────────────────────────────────────────────────────────────┤
│                  Validation Framework                       │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ Components  │    Hooks    │    Rules    │   Errors    │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│               Core Libraries & Utilities                    │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │React Hook   │   Yup/Zod   │   i18next   │  Material   │  │
│  │    Form     │   Schemas   │     i18n    │     UI      │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                              │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   Error     │   Server    │   Laravel   │    Axios    │  │
│  │  Mappers    │ Validation  │ Integration │Interceptors │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Debounced Validation → Schema Validation → Error Display
     ↓                                      ↓
Form Submission → Server API → Error Mapping → Field Errors
```

## Installation

### Prerequisites

- React 18+
- Material-UI 5+
- React Hook Form 7+

### Dependencies

The system requires the following packages (already installed):

```json
{
  "@hookform/resolvers": "^3.9.1",
  "react-hook-form": "^7.62.0",
  "yup": "^1.4.0",
  "zod": "^3.24.1",
  "@tanstack/react-query": "^5.60.6",
  "i18next": "^24.0.5",
  "react-i18next": "^15.1.1",
  "lodash": "^4.17.21"
}
```

### File Structure

```
frontend/src/utils/validation/
├── index.js                 # Main export file
├── validationRules.js       # Core validation patterns and rules
├── formHooks.js            # Custom hooks for form management
├── formComponents.js       # Enhanced form components
├── errorHandling.js        # Error boundaries and handlers
├── apiErrorMapper.js       # Server error integration
└── schemas/
    ├── userSchema.js
    ├── barangSchema.js
    ├── customerSchema.js
    └── transactionSchema.js

frontend/src/locales/
├── i18n.js                 # i18n configuration
├── id.js                   # Indonesian translations
└── en.js                   # English translations
```

## Quick Start

### 1. Basic Form Setup

```jsx
import { ValidatedForm, ValidatedTextField, FormActions } from '@/utils/validation';
import { COMMON_SCHEMAS } from '@/utils/validation/validationRules';

const MyForm = () => {
  const handleSubmit = data => {
    console.log('Form data:', data);
  };

  return (
    <ValidatedForm
      onSubmit={handleSubmit}
      schema={COMMON_SCHEMAS.user}
      defaultValues={{ email: '', password: '' }}
    >
      <ValidatedTextField name="email" label="Email" type="email" rules={{ required: true }} />

      <ValidatedTextField
        name="password"
        label="Password"
        type="password"
        rules={{ required: true, minLength: 8 }}
      />

      <FormActions submitText="Login" />
    </ValidatedForm>
  );
};
```

### 2. Enhanced Form with Custom Validation

```jsx
import { useEnhancedForm, ValidatedTextField } from '@/utils/validation';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string().required().min(3).max(20),
  email: yup.string().email().required(),
  age: yup.number().min(13).max(120),
});

const UserForm = () => {
  const { formMethods, isValid, errors } = useEnhancedForm({
    schema,
    defaultValues: { username: '', email: '', age: '' },
  });

  const handleSubmit = formMethods.handleSubmit(data => {
    console.log('User data:', data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <ValidatedTextField name="username" label="Username" />
      <ValidatedTextField name="email" label="Email" type="email" />
      <ValidatedTextField name="age" label="Age" type="number" />

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
```

### 3. Error Handling Setup

```jsx
import { ErrorBoundary, ErrorProvider } from '@/utils/validation';

const App = () => (
  <ErrorProvider>
    <ErrorBoundary>
      <MyApplication />
    </ErrorBoundary>
  </ErrorProvider>
);
```

## API Reference

### Core Components

#### ValidatedForm

Main form wrapper with validation support.

```jsx
<ValidatedForm
  onSubmit={handleSubmit} // Function: Form submission handler
  schema={validationSchema} // Yup/Zod: Validation schema
  defaultValues={defaultValues} // Object: Initial form values
  mode="onChange" // String: Validation mode
  formMethods={formMethods} // Object: External form methods
>
  {children}
</ValidatedForm>
```

#### ValidatedTextField

Enhanced text field with built-in validation.

```jsx
<ValidatedTextField
  name="fieldName" // String: Field name (required)
  label="Field Label" // String: Field label
  type="text" // String: Input type
  rules={validationRules} // Object: Validation rules
  placeholder="Enter value" // String: Placeholder text
  helperText="Helper text" // String: Helper text
  tooltip="Tooltip text" // String: Tooltip
  multiline={false} // Boolean: Multiline input
  rows={1} // Number: Textarea rows
  prefix="$" // String/Component: Input prefix
  suffix="%" // String/Component: Input suffix
  showValidationIcon={true} // Boolean: Show validation icon
  debounceMs={300} // Number: Debounce delay
  formatValue={formatFunction} // Function: Value formatter
  parseValue={parseFunction} // Function: Value parser
/>
```

#### ValidatedSelectField

Select dropdown with validation.

```jsx
<ValidatedSelectField
  name="fieldName" // String: Field name (required)
  label="Field Label" // String: Field label
  options={optionsArray} // Array: Select options
  rules={validationRules} // Object: Validation rules
  multiple={false} // Boolean: Multiple selection
  placeholder="Select..." // String: Placeholder
  allowClear={true} // Boolean: Allow clearing
  valueKey="value" // String: Value property key
  labelKey="label" // String: Label property key
/>
```

### Custom Hooks

#### useEnhancedForm

Main hook for form management with validation.

```jsx
const {
  formMethods, // Object: React Hook Form methods
  isValid, // Boolean: Form validity
  isDirty, // Boolean: Form dirty state
  errors, // Object: Form errors
  watch, // Function: Watch field values
  setValue, // Function: Set field value
  reset, // Function: Reset form
  clearErrors, // Function: Clear errors
  trigger, // Function: Trigger validation
} = useEnhancedForm({
  schema: validationSchema, // Yup/Zod: Validation schema
  defaultValues: {}, // Object: Default values
  mode: 'onChange', // String: Validation mode
  reValidateMode: 'onChange', // String: Re-validation mode
});
```

#### useFormField

Hook for individual field management.

```jsx
const {
  field, // Object: Field props
  fieldState, // Object: Field state
  formState, // Object: Form state
} = useFormField(
  'fieldName', // String: Field name
  { rules: validationRules } // Object: Field options
);
```

#### useConditionalValidation

Hook for conditional validation rules.

```jsx
const {
  conditionalRules, // Object: Conditional rules
  updateConditions, // Function: Update conditions
} = useConditionalValidation({
  condition: watchedValue === 'something', // Boolean: Condition
  rules: conditionalRules, // Object: Rules when condition true
});
```

### Validation Rules

#### Predefined Rules

```jsx
import { VALIDATION_RULES } from '@/utils/validation';

// Basic rules
VALIDATION_RULES.required; // Required field
VALIDATION_RULES.email; // Email format
VALIDATION_RULES.phone; // Phone format
VALIDATION_RULES.numeric; // Numeric only
VALIDATION_RULES.alphanumeric; // Alphanumeric only
VALIDATION_RULES.positiveNumber; // Positive number
VALIDATION_RULES.url; // URL format
VALIDATION_RULES.currency; // Currency format
VALIDATION_RULES.percentage; // Percentage (0-100)

// String length rules
VALIDATION_RULES.minLength(n); // Minimum length
VALIDATION_RULES.maxLength(n); // Maximum length

// Number range rules
VALIDATION_RULES.min(n); // Minimum value
VALIDATION_RULES.max(n); // Maximum value
VALIDATION_RULES.between(min, max); // Value range
```

#### Custom Rules

```jsx
const customRules = {
  uniqueUsername: {
    validate: async value => {
      const exists = await checkUsernameExists(value);
      return !exists || 'Username already exists';
    },
  },

  strongPassword: {
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      message: 'Password must contain uppercase, lowercase, number, and symbol',
    },
  },

  matchField: fieldName => ({
    validate: (value, formValues) => value === formValues[fieldName] || `Must match ${fieldName}`,
  }),
};
```

### Error Handling

#### Error Types

```jsx
import { ERROR_TYPES, ERROR_SEVERITY } from '@/utils/validation';

ERROR_TYPES.VALIDATION; // Validation error
ERROR_TYPES.NETWORK; // Network error
ERROR_TYPES.SERVER; // Server error
ERROR_TYPES.CLIENT; // Client error
ERROR_TYPES.AUTHENTICATION; // Auth error
ERROR_TYPES.AUTHORIZATION; // Authorization error
ERROR_TYPES.NOT_FOUND; // Not found error
ERROR_TYPES.TIMEOUT; // Timeout error

ERROR_SEVERITY.LOW; // Info level
ERROR_SEVERITY.MEDIUM; // Warning level
ERROR_SEVERITY.HIGH; // Error level
ERROR_SEVERITY.CRITICAL; // Critical level
```

#### Error Components

```jsx
import { ErrorBoundary, InlineError, FieldError } from '@/utils/validation';

// Error boundary for component-level error handling
<ErrorBoundary onError={errorHandler} showDetails={true}>
  <MyComponent />
</ErrorBoundary>

// Inline error for form sections
<InlineError
  error={errorMessage}
  severity="medium"
  onDismiss={dismissHandler}
/>

// Field-level error display
<FieldError
  error={fieldError}
  fieldName="username"
  showFieldName={true}
/>
```

## Components

### FormSection

Organizes form fields into logical sections.

```jsx
<FormSection
  title="Personal Information"
  subtitle="Enter your personal details"
  collapsible={true}
  defaultExpanded={true}
  required={true}
>
  <ValidatedTextField name="firstName" label="First Name" />
  <ValidatedTextField name="lastName" label="Last Name" />
</FormSection>
```

### ValidatedArrayField

Manages dynamic arrays of form fields.

```jsx
<ValidatedArrayField
  name="items"
  label="Order Items"
  renderField={(field, index, name) => (
    <div key={field.id}>
      <ValidatedTextField name={`${name}.name`} label="Item Name" />
      <ValidatedTextField name={`${name}.quantity`} label="Quantity" type="number" />
    </div>
  )}
  addButtonText="Add Item"
  removeButtonText="Remove"
  minItems={1}
  maxItems={10}
  defaultValue={{ name: '', quantity: 1 }}
/>
```

### FormActions

Standardized form action buttons.

```jsx
<FormActions
  submitText="Save Changes"
  cancelText="Cancel"
  resetText="Reset"
  onCancel={handleCancel}
  onReset={handleReset}
  showReset={true}
  showCancel={true}
  loading={isSubmitting}
  disabled={!isValid}
/>
```

## Validation Rules

### Pattern-based Validation

```jsx
import { VALIDATION_PATTERNS } from '@/utils/validation';

// Email validation
const emailRule = {
  pattern: {
    value: VALIDATION_PATTERNS.email,
    message: 'Invalid email format',
  },
};

// Phone validation (Indonesian format)
const phoneRule = {
  pattern: {
    value: VALIDATION_PATTERNS.phone,
    message: 'Invalid phone number',
  },
};

// Currency validation
const currencyRule = {
  pattern: {
    value: VALIDATION_PATTERNS.currency,
    message: 'Invalid currency format',
  },
};
```

### Schema-based Validation

```jsx
import * as yup from 'yup';
import { COMMON_SCHEMAS } from '@/utils/validation';

// Use predefined schemas
const userSchema = COMMON_SCHEMAS.user;
const barangSchema = COMMON_SCHEMAS.barang;

// Custom schema
const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .max(1000000, 'Price cannot exceed 1,000,000'),

  category: yup
    .string()
    .required('Category is required')
    .oneOf(['electronics', 'clothing', 'books'], 'Invalid category'),

  description: yup.string().max(500, 'Description cannot exceed 500 characters'),

  inStock: yup.boolean().default(true),

  tags: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Cannot have more than 5 tags'),
});
```

### Cross-field Validation

```jsx
const registrationSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  startDate: yup.date().required('Start date is required'),

  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
});
```

### Async Validation

```jsx
const usernameSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .test('unique-username', 'Username already exists', async value => {
      if (!value) return true;

      try {
        const response = await fetch(`/api/users/check-username?username=${value}`);
        const data = await response.json();
        return !data.exists;
      } catch (error) {
        // In case of error, assume valid to not block user
        return true;
      }
    }),
});
```

## Error Handling

### Global Error Handler

```jsx
import { useGlobalErrorHandler } from '@/utils/validation';

const MyComponent = () => {
  const { handleError } = useGlobalErrorHandler();

  const saveData = async data => {
    try {
      await api.save(data);
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to save data',
        onError: parsedError => {
          console.log('Error details:', parsedError);
        },
      });
    }
  };
};
```

### API Error Integration

```jsx
import { parseApiError, handleFormSubmissionError } from '@/utils/validation';

const FormComponent = () => {
  const { formMethods } = useEnhancedForm();

  const handleSubmit = async data => {
    try {
      await api.saveUser(data);
    } catch (error) {
      // Automatically map server validation errors to form fields
      handleFormSubmissionError(error, formMethods.setError);
    }
  };
};
```

### Custom Error Boundaries

```jsx
import { ErrorBoundary } from '@/utils/validation';

const CustomErrorFallback = ({ error, onRetry }) => (
  <div className="error-container">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={onRetry}>Try Again</button>
  </div>
);

const App = () => (
  <ErrorBoundary fallback={CustomErrorFallback}>
    <MyApplication />
  </ErrorBoundary>
);
```

## Internationalization

### Language Configuration

```jsx
// In your main app file
import { initializeValidationFramework } from '@/utils/validation';
import '@/locales/i18n'; // Initialize i18n

// Initialize validation framework
initializeValidationFramework({
  defaultLanguage: 'id',
  supportedLanguages: ['id', 'en'],
});
```

### Using Translations

```jsx
import { useTranslation } from 'react-i18next';
import { formatValidationMessage, getFieldName } from '@/utils/validation';

const MyForm = () => {
  const { t } = useTranslation();

  return (
    <ValidatedTextField
      name="email"
      label={t('fields.user.email')}
      rules={{
        required: formatValidationMessage('required', 'user.email'),
      }}
    />
  );
};
```

### Adding Custom Translations

```jsx
// In locales/id.js
export default {
  translation: {
    validation: {
      customRule: '{{field}} tidak memenuhi kriteria khusus',
    },
    fields: {
      product: {
        customField: 'Field Khusus',
      },
    },
  },
};
```

## Examples

### Complete Registration Form

```jsx
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import {
  ValidatedForm,
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedCheckboxGroup,
  FormSection,
  FormActions,
  ErrorBoundary,
} from '@/utils/validation';
import * as yup from 'yup';

const registrationSchema = yup.object({
  // Personal Info
  firstName: yup.string().required().max(50),
  lastName: yup.string().required().max(50),
  email: yup.string().email().required(),
  phone: yup.string().matches(/^(\+62|62|0)8[1-9][0-9]{6,9}$/),

  // Account Info
  username: yup.string().required().min(3).max(20),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),

  // Preferences
  interests: yup.array().min(1, 'Select at least one interest'),
  newsletter: yup.boolean(),
  terms: yup.boolean().oneOf([true], 'You must accept the terms'),
});

const RegistrationForm = () => {
  const interestOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'travel', label: 'Travel' },
  ];

  const handleSubmit = async data => {
    try {
      await api.register(data);
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <ErrorBoundary>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        <ValidatedForm
          onSubmit={handleSubmit}
          schema={registrationSchema}
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            confirmPassword: '',
            interests: [],
            newsletter: false,
            terms: false,
          }}
        >
          <FormSection title="Personal Information" subtitle="Tell us about yourself" required>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="firstName"
                  label="First Name"
                  rules={{ required: true, maxLength: 50 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="lastName"
                  label="Last Name"
                  rules={{ required: true, maxLength: 50 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="email"
                  label="Email Address"
                  type="email"
                  rules={{ required: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="phone"
                  label="Phone Number"
                  placeholder="081234567890"
                  helperText="Indonesian phone number format"
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Account Setup" subtitle="Create your login credentials" required>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ValidatedTextField
                  name="username"
                  label="Username"
                  rules={{ required: true, minLength: 3, maxLength: 20 }}
                  helperText="3-20 characters, alphanumeric only"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="password"
                  label="Password"
                  type="password"
                  rules={{ required: true }}
                  helperText="Must contain uppercase, lowercase, number, and special character"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ValidatedTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  rules={{ required: true }}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Preferences" subtitle="Customize your experience">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ValidatedCheckboxGroup
                  name="interests"
                  label="Interests"
                  options={interestOptions}
                  rules={{ required: 'Select at least one interest' }}
                />
              </Grid>

              <Grid item xs={12}>
                <ValidatedSwitch
                  name="newsletter"
                  label="Subscribe to newsletter"
                  helperText="Get updates about new features and content"
                />
              </Grid>

              <Grid item xs={12}>
                <ValidatedSwitch
                  name="terms"
                  label="I accept the Terms of Service and Privacy Policy"
                  rules={{ required: 'You must accept the terms to continue' }}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormActions
            submitText="Create Account"
            cancelText="Back to Login"
            onCancel={() => window.history.back()}
            showReset={false}
          />
        </ValidatedForm>
      </Paper>
    </ErrorBoundary>
  );
};

export default RegistrationForm;
```

### Dynamic Order Form

```jsx
import React from 'react';
import {
  ValidatedForm,
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedArrayField,
  FormSection,
  FormActions,
  useEnhancedForm,
} from '@/utils/validation';
import * as yup from 'yup';

const orderItemSchema = yup.object({
  product: yup.string().required('Product is required'),
  quantity: yup.number().required().min(1).max(100),
  price: yup.number().required().min(0),
  discount: yup.number().min(0).max(100).default(0),
});

const orderSchema = yup.object({
  customer: yup.string().required('Customer is required'),
  orderDate: yup.date().required(),
  items: yup.array().of(orderItemSchema).min(1, 'Add at least one item'),
  notes: yup.string().max(500),
});

const OrderForm = () => {
  const { formMethods, watch } = useEnhancedForm({
    schema: orderSchema,
    defaultValues: {
      customer: '',
      orderDate: new Date().toISOString().split('T')[0],
      items: [{ product: '', quantity: 1, price: 0, discount: 0 }],
      notes: '',
    },
  });

  const watchedItems = watch('items');

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    const discountAmount = itemTotal * ((item.discount || 0) / 100);
    return sum + itemTotal - discountAmount;
  }, 0);

  const renderOrderItem = (field, index, name) => (
    <Grid container spacing={2} key={field.id}>
      <Grid item xs={12} md={4}>
        <ValidatedSelectField
          name={`${name}.product`}
          label="Product"
          options={productOptions}
          rules={{ required: 'Product is required' }}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <ValidatedTextField
          name={`${name}.quantity`}
          label="Qty"
          type="number"
          rules={{ required: true, min: 1, max: 100 }}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <ValidatedTextField
          name={`${name}.price`}
          label="Price"
          type="number"
          rules={{ required: true, min: 0 }}
          prefix="$"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <ValidatedTextField
          name={`${name}.discount`}
          label="Discount"
          type="number"
          rules={{ min: 0, max: 100 }}
          suffix="%"
        />
      </Grid>
    </Grid>
  );

  const handleSubmit = data => {
    console.log('Order data:', { ...data, subtotal });
  };

  return (
    <ValidatedForm onSubmit={handleSubmit} formMethods={formMethods}>
      <FormSection title="Order Information" required>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ValidatedSelectField
              name="customer"
              label="Customer"
              options={customerOptions}
              rules={{ required: 'Customer is required' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedTextField
              name="orderDate"
              label="Order Date"
              type="date"
              rules={{ required: 'Order date is required' }}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection title="Order Items" required>
        <ValidatedArrayField
          name="items"
          label="Products"
          renderField={renderOrderItem}
          addButtonText="Add Product"
          minItems={1}
          maxItems={10}
          defaultValue={{ product: '', quantity: 1, price: 0, discount: 0 }}
        />

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
        </Box>
      </FormSection>

      <FormSection title="Additional Information">
        <ValidatedTextField
          name="notes"
          label="Order Notes"
          multiline
          rows={3}
          rules={{ maxLength: 500 }}
          placeholder="Special instructions or notes..."
        />
      </FormSection>

      <FormActions submitText="Create Order" />
    </ValidatedForm>
  );
};
```

## Best Practices

### 1. Form Structure

- Use `FormSection` to organize related fields
- Group validation rules logically
- Provide clear field labels and helper text
- Use appropriate input types for better UX

### 2. Validation Strategy

- Start with client-side validation for immediate feedback
- Implement server-side validation for security
- Use debounced validation for performance
- Provide specific, actionable error messages

### 3. Error Handling

- Use error boundaries to catch and handle errors gracefully
- Map server errors to appropriate form fields
- Provide retry mechanisms for network errors
- Log errors for debugging and monitoring

### 4. Performance

- Use debounced validation to avoid excessive API calls
- Implement lazy loading for large option lists
- Cache validation results when appropriate
- Optimize re-renders with proper memoization

### 5. Accessibility

- Provide proper ARIA labels and descriptions
- Ensure keyboard navigation works correctly
- Use high contrast colors for error states
- Test with screen readers

### 6. Internationalization

- Use translation keys instead of hardcoded messages
- Provide context for translators
- Format numbers, dates, and currencies according to locale
- Support RTL languages if needed

## Performance

### Optimization Techniques

1. **Debounced Validation**: Input validation is debounced by 300ms to prevent excessive validation calls.

2. **Selective Re-rendering**: Components only re-render when their specific field values change.

3. **Lazy Schema Validation**: Schemas are only validated when necessary.

4. **Memoized Components**: Expensive components are memoized to prevent unnecessary re-renders.

5. **Async Validation Caching**: Results of async validations are cached to avoid duplicate API calls.

### Performance Monitoring

```jsx
import { useFormAnalytics } from '@/utils/validation';

const MyForm = () => {
  const analytics = useFormAnalytics();

  // Analytics data available:
  // - validation times
  // - error rates
  // - form completion rates
  // - field interaction patterns
};
```

## Accessibility

### WCAG 2.1 AA Compliance

The validation framework ensures accessibility through:

1. **Semantic HTML**: Proper form structure with labels and fieldsets
2. **ARIA Support**: Comprehensive ARIA labels and descriptions
3. **Keyboard Navigation**: Full keyboard support for all interactions
4. **Screen Reader Support**: Proper announcements for validation states
5. **High Contrast**: Accessible color schemes for error states
6. **Focus Management**: Logical focus order and visible focus indicators

### Testing Accessibility

```jsx
// Use these tools to test accessibility:
// - axe-core browser extension
// - React Testing Library accessibility queries
// - Screen reader testing (NVDA, JAWS, VoiceOver)

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('form should be accessible', async () => {
  const { container } = render(<MyForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Troubleshooting

### Common Issues

#### 1. Validation Not Triggering

```jsx
// Problem: Validation doesn't trigger on field change
// Solution: Check validation mode and rules

const { formMethods } = useEnhancedForm({
  mode: 'onChange', // Make sure this is set
  rules: { required: true }, // Ensure rules are properly defined
});
```

#### 2. Server Errors Not Mapping

```jsx
// Problem: Server validation errors not showing in form
// Solution: Use error mapper

import { handleFormSubmissionError } from '@/utils/validation';

try {
  await api.save(data);
} catch (error) {
  handleFormSubmissionError(error, formMethods.setError);
}
```

#### 3. Performance Issues

```jsx
// Problem: Form is slow to respond
// Solution: Check debounce settings and optimize validation

<ValidatedTextField
  name="field"
  debounceMs={500} // Increase debounce delay
  rules={optimizedRules} // Simplify validation rules
/>
```

#### 4. Translation Not Working

```jsx
// Problem: Error messages not translated
// Solution: Check i18n configuration and translation keys

import { formatValidationMessage } from '@/utils/validation';

const errorMessage = formatValidationMessage('required', 'user.email');
```

### Debug Mode

Enable debug mode for detailed logging:

```jsx
import { initializeValidationFramework } from '@/utils/validation';

initializeValidationFramework({
  enableDebugMode: true,
  enableAnalytics: true,
});
```

### Getting Help

1. Check browser console for detailed error messages
2. Use React Developer Tools to inspect form state
3. Enable debug mode for validation framework logging
4. Review network tab for API error responses

## Conclusion

This comprehensive validation framework provides a robust foundation for form validation and error handling in React applications. It combines the power of React Hook Form, Yup/Zod schemas, and Material-UI components to create a seamless development experience while ensuring excellent user experience, accessibility, and internationalization support.

The framework is designed to be:

- **Developer-friendly**: Easy to use with minimal boilerplate
- **User-friendly**: Provides clear, actionable feedback
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Optimized for large forms and complex validation
- **Maintainable**: Well-structured and documented code
- **Extensible**: Easy to customize and extend for specific needs

For additional support or questions, refer to the component documentation and examples provided in this guide.
