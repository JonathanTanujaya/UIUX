import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Switch,
  Chip,
  Autocomplete,
  DatePicker,
  TimePicker,
  Button,
  IconButton,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { Add, Delete, DragIndicator } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const AdvancedFormBuilder = ({
  fields = [],
  initialValues = {},
  onSubmit,
  onFieldChange,
  title,
  submitButtonText = 'Submit',
  showPreview = false,
}) => {
  const [isDirty, setIsDirty] = useState(false);

  // Generate validation schema from fields
  const validationSchema = useMemo(() => {
    const schema = {};
    
    fields.forEach(field => {
      let fieldSchema = yup.string();
      
      switch (field.type) {
        case 'email':
          fieldSchema = fieldSchema.email('Invalid email format');
          break;
        case 'number':
          fieldSchema = yup.number().typeError('Must be a number');
          break;
        case 'phone':
          fieldSchema = fieldSchema.matches(
            /^[\+]?[1-9][\d]{0,15}$/,
            'Invalid phone number'
          );
          break;
        case 'url':
          fieldSchema = fieldSchema.url('Invalid URL format');
          break;
        case 'date':
          fieldSchema = yup.date().typeError('Invalid date');
          break;
      }

      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }

      if (field.minLength) {
        fieldSchema = fieldSchema.min(
          field.minLength,
          `Minimum ${field.minLength} characters required`
        );
      }

      if (field.maxLength) {
        fieldSchema = fieldSchema.max(
          field.maxLength,
          `Maximum ${field.maxLength} characters allowed`
        );
      }

      if (field.pattern) {
        fieldSchema = fieldSchema.matches(
          new RegExp(field.pattern),
          field.patternMessage || 'Invalid format'
        );
      }

      if (field.customValidation) {
        fieldSchema = fieldSchema.test(
          'custom',
          field.customValidation.message,
          field.customValidation.validate
        );
      }

      schema[field.name] = fieldSchema;
    });

    return yup.object().shape(schema);
  }, [fields]);

  const formik = useFormik({
    initialValues: {
      ...fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || '';
        return acc;
      }, {}),
      ...initialValues,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit?.(values);
      setIsDirty(false);
    },
  });

  const handleFieldChange = useCallback((fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    setIsDirty(true);
    onFieldChange?.(fieldName, value, formik.values);
  }, [formik, onFieldChange]);

  const renderField = useCallback((field) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      value: formik.values[field.name] || '',
      onChange: (e) => handleFieldChange(field.name, e.target.value),
      error: formik.touched[field.name] && Boolean(formik.errors[field.name]),
      helperText: formik.touched[field.name] && formik.errors[field.name],
      fullWidth: field.fullWidth !== false,
      disabled: field.disabled,
      placeholder: field.placeholder,
      sx: { mb: 2 },
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'phone':
        return (
          <TextField
            {...commonProps}
            type={field.type}
            multiline={field.multiline}
            rows={field.rows || 1}
            InputProps={field.inputProps}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            type="number"
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step,
              ...field.inputProps,
            }}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={field.rows || 4}
            maxRows={field.maxRows}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth sx={{ mb: 2 }} error={commonProps.error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              {...commonProps}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {commonProps.helperText && (
              <FormHelperText>{commonProps.helperText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            options={field.options || []}
            getOptionLabel={(option) => option.label || option}
            value={field.options?.find(opt => opt.value === formik.values[field.name]) || null}
            onChange={(_, newValue) => 
              handleFieldChange(field.name, newValue?.value || '')
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                error={commonProps.error}
                helperText={commonProps.helperText}
                sx={{ mb: 2 }}
              />
            )}
            multiple={field.multiple}
            freeSolo={field.freeSolo}
          />
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formik.values[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
            sx={{ mb: 2 }}
          />
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formik.values[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
            sx={{ mb: 2 }}
          />
        );

      case 'radio':
        return (
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={formik.values[field.name]}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              row={field.row}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {commonProps.helperText && (
              <FormHelperText error>{commonProps.helperText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'chips':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {(formik.values[field.name] || []).map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  onDelete={() => {
                    const newChips = [...formik.values[field.name]];
                    newChips.splice(index, 1);
                    handleFieldChange(field.name, newChips);
                  }}
                />
              ))}
            </Box>
          </Box>
        );

      case 'divider':
        return <Divider sx={{ my: 3 }} />;

      case 'heading':
        return (
          <Typography 
            variant={field.variant || 'h6'} 
            sx={{ mb: 2, mt: 2 }}
          >
            {field.text}
          </Typography>
        );

      default:
        return null;
    }
  }, [formik, handleFieldChange]);

  // Group fields by section
  const groupedFields = useMemo(() => {
    const groups = { main: [] };
    
    fields.forEach(field => {
      const section = field.section || 'main';
      if (!groups[section]) groups[section] = [];
      groups[section].push(field);
    });
    
    return groups;
  }, [fields]);

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}

      <form onSubmit={formik.handleSubmit}>
        {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
          <Box key={sectionName} mb={3}>
            {sectionName !== 'main' && (
              <Typography variant="h6" gutterBottom>
                {sectionName}
              </Typography>
            )}
            
            <Grid container spacing={2}>
              {sectionFields.map((field) => (
                <Grid 
                  item 
                  xs={field.xs || 12} 
                  sm={field.sm || 12} 
                  md={field.md || 12}
                  key={field.name}
                >
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Submitting...' : submitButtonText}
          </Button>
        </Box>
      </form>

      {/* Dirty state indicator */}
      {isDirty && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
          You have unsaved changes
        </Typography>
      )}

      {/* Preview mode */}
      {showPreview && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Form Data Preview
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <pre>{JSON.stringify(formik.values, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default AdvancedFormBuilder;
