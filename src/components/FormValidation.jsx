import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Error, CheckCircle, Warning, Info } from '@mui/icons-material';

// Form validation utilities
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateNumber = (value, fieldName = 'Field') => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName = 'Field') => {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;

  if (value && Number(value) <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

export const validatePhoneNumber = phone => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Validation hook
export const useFormValidation = validationRules => {
  const validateForm = formData => {
    const errors = {};

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = formData[field];

      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    });

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

  return { validateForm };
};

// Form error display component
export const FormErrors = ({ errors, title = 'Please fix the following errors:' }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      <List dense>
        {Object.entries(errors).map(([field, error]) => (
          <ListItem key={field} sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 20 }}>
              <Error fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2' }} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

// Success message component
export const SuccessMessage = ({ message, title = 'Success!' }) => (
  <Alert severity="success" sx={{ mb: 2 }}>
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

// Warning message component
export const WarningMessage = ({ message, title = 'Warning' }) => (
  <Alert severity="warning" sx={{ mb: 2 }}>
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

// Info message component
export const InfoMessage = ({ message, title = 'Information' }) => (
  <Alert severity="info" sx={{ mb: 2 }}>
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

// Field validation status indicator
export const ValidationStatus = ({ isValid, message }) => {
  if (isValid === null || isValid === undefined) return null;

  return (
    <Box display="flex" alignItems="center" mt={0.5}>
      {isValid ? (
        <CheckCircle color="success" fontSize="small" />
      ) : (
        <Error color="error" fontSize="small" />
      )}
      {message && (
        <Typography
          variant="caption"
          color={isValid ? 'success.main' : 'error.main'}
          sx={{ ml: 0.5 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default useFormValidation;
