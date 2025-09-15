// Enhanced form components with integrated validation framework
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  RadioGroup,
  Radio,
  Autocomplete,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  InputAdornment,
  Switch,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility,
  VisibilityOff,
  Clear as ClearIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useEnhancedForm, useFormField, useFormArray } from './formHooks';
import { FieldError, InlineError } from './errorHandling';
import { debounce } from 'lodash';

// Enhanced Text Field with validation
export const ValidatedTextField = ({
  name,
  label,
  rules = {},
  type = 'text',
  multiline = false,
  rows = 1,
  placeholder,
  helperText,
  tooltip,
  prefix,
  suffix,
  showValidationIcon = true,
  debounceMs = 300,
  formatValue,
  parseValue,
  ...props
}) => {
  const { field, fieldState, formState } = useFormField(name, { rules });

  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState(field.value || '');

  // Debounced value update
  const debouncedOnChange = useMemo(
    () =>
      debounce(value => {
        const parsedValue = parseValue ? parseValue(value) : value;
        field.onChange(parsedValue);
      }, debounceMs),
    [field.onChange, parseValue, debounceMs]
  );

  const handleLocalChange = event => {
    const value = event.target.value;
    setLocalValue(value);
    debouncedOnChange(value);
  };

  useEffect(() => {
    const formattedValue = formatValue ? formatValue(field.value) : field.value;
    setLocalValue(formattedValue || '');
  }, [field.value, formatValue]);

  // Password visibility toggle
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Clear field
  const handleClear = () => {
    setLocalValue('');
    field.onChange('');
  };

  const getValidationIcon = () => {
    if (!showValidationIcon || !fieldState.isTouched) return null;

    if (fieldState.error) {
      return <ErrorIcon color="error" fontSize="small" />;
    }

    if (!fieldState.error && localValue) {
      return <CheckIcon color="success" fontSize="small" />;
    }

    return null;
  };

  const inputProps = {
    ...props.InputProps,
    startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
    endAdornment: (
      <InputAdornment position="end">
        {suffix}
        {type === 'password' && (
          <IconButton onClick={handleTogglePassword} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
        {localValue && type !== 'password' && (
          <IconButton onClick={handleClear} edge="end" size="small">
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
        {getValidationIcon()}
      </InputAdornment>
    ),
  };

  return (
    <Box>
      <FormControl fullWidth error={!!fieldState.error}>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top-start">
            <TextField
              {...props}
              name={name}
              label={label}
              value={localValue}
              onChange={handleLocalChange}
              onBlur={field.onBlur}
              type={type === 'password' && showPassword ? 'text' : type}
              multiline={multiline}
              rows={multiline ? rows : undefined}
              placeholder={placeholder}
              helperText={helperText}
              error={!!fieldState.error}
              InputProps={inputProps}
            />
          </Tooltip>
        ) : (
          <TextField
            {...props}
            name={name}
            label={label}
            value={localValue}
            onChange={handleLocalChange}
            onBlur={field.onBlur}
            type={type === 'password' && showPassword ? 'text' : type}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            placeholder={placeholder}
            helperText={helperText}
            error={!!fieldState.error}
            InputProps={inputProps}
          />
        )}
      </FormControl>
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Enhanced Select Field
export const ValidatedSelectField = ({
  name,
  label,
  options = [],
  rules = {},
  placeholder = 'Pilih...',
  helperText,
  multiple = false,
  allowClear = true,
  valueKey = 'value',
  labelKey = 'label',
  ...props
}) => {
  const { field, fieldState } = useFormField(name, { rules });

  const handleChange = event => {
    const value = event.target.value;
    field.onChange(multiple && value === '' ? [] : value);
  };

  const handleClear = () => {
    field.onChange(multiple ? [] : '');
  };

  return (
    <Box>
      <FormControl fullWidth error={!!fieldState.error}>
        <FormLabel>{label}</FormLabel>
        <Select
          {...props}
          name={name}
          value={field.value || (multiple ? [] : '')}
          onChange={handleChange}
          onBlur={field.onBlur}
          multiple={multiple}
          displayEmpty
          renderValue={selected => {
            if (multiple) {
              if (selected.length === 0) return <em>{placeholder}</em>;
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => {
                    const option = options.find(opt => opt[valueKey] === value);
                    return (
                      <Chip key={value} label={option ? option[labelKey] : value} size="small" />
                    );
                  })}
                </Box>
              );
            }

            if (selected === '') return <em>{placeholder}</em>;
            const option = options.find(opt => opt[valueKey] === selected);
            return option ? option[labelKey] : selected;
          }}
          endAdornment={
            allowClear &&
            field.value && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end" size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }
        >
          {!multiple && (
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map(option => (
            <MenuItem key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Enhanced Autocomplete Field
export const ValidatedAutocompleteField = ({
  name,
  label,
  options = [],
  rules = {},
  placeholder = 'Pilih atau ketik...',
  helperText,
  multiple = false,
  freeSolo = false,
  loading = false,
  onInputChange,
  getOptionLabel = option => option.label || option,
  getOptionValue = option => option.value || option,
  filterOptions,
  renderOption,
  ...props
}) => {
  const { field, fieldState } = useFormField(name, { rules });

  const handleChange = (event, newValue) => {
    if (multiple) {
      const values = newValue.map(item => (typeof item === 'string' ? item : getOptionValue(item)));
      field.onChange(values);
    } else {
      const value = newValue
        ? typeof newValue === 'string'
          ? newValue
          : getOptionValue(newValue)
        : null;
      field.onChange(value);
    }
  };

  const getValue = () => {
    if (multiple) {
      return (field.value || []).map(
        val => options.find(opt => getOptionValue(opt) === val) || val
      );
    }

    return field.value
      ? options.find(opt => getOptionValue(opt) === field.value) || field.value
      : null;
  };

  return (
    <Box>
      <Autocomplete
        {...props}
        options={options}
        value={getValue()}
        onChange={handleChange}
        onInputChange={onInputChange}
        multiple={multiple}
        freeSolo={freeSolo}
        loading={loading}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions}
        renderOption={renderOption}
        renderInput={params => (
          <TextField
            {...params}
            name={name}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            error={!!fieldState.error}
            onBlur={field.onBlur}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={index}
              label={getOptionLabel(option)}
              size="small"
            />
          ))
        }
      />
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Checkbox Group Component
export const ValidatedCheckboxGroup = ({
  name,
  label,
  options = [],
  rules = {},
  helperText,
  row = false,
  ...props
}) => {
  const { field, fieldState } = useFormField(name, { rules });

  const handleChange = (optionValue, checked) => {
    const currentValue = field.value || [];
    let newValue;

    if (checked) {
      newValue = [...currentValue, optionValue];
    } else {
      newValue = currentValue.filter(val => val !== optionValue);
    }

    field.onChange(newValue);
  };

  return (
    <Box>
      <FormControl error={!!fieldState.error}>
        <FormLabel component="legend">{label}</FormLabel>
        <Box sx={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: 'wrap' }}>
          {options.map(option => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={(field.value || []).includes(option.value)}
                  onChange={e => handleChange(option.value, e.target.checked)}
                  name={`${name}_${option.value}`}
                />
              }
              label={option.label}
            />
          ))}
        </Box>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Radio Group Component
export const ValidatedRadioGroup = ({
  name,
  label,
  options = [],
  rules = {},
  helperText,
  row = false,
  ...props
}) => {
  const { field, fieldState } = useFormField(name, { rules });

  return (
    <Box>
      <FormControl error={!!fieldState.error}>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          {...props}
          name={name}
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          row={row}
        >
          {options.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Switch Component
export const ValidatedSwitch = ({
  name,
  label,
  rules = {},
  helperText,
  labelPlacement = 'end',
  ...props
}) => {
  const { field, fieldState } = useFormField(name, { rules });

  return (
    <Box>
      <FormControl error={!!fieldState.error}>
        <FormControlLabel
          control={
            <Switch
              {...props}
              checked={!!field.value}
              onChange={e => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={name}
            />
          }
          label={label}
          labelPlacement={labelPlacement}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      <FieldError error={fieldState.error?.message} />
    </Box>
  );
};

// Dynamic Array Fields Component
export const ValidatedArrayField = ({
  name,
  label,
  renderField,
  addButtonText = 'Tambah Item',
  removeButtonText = 'Hapus',
  minItems = 0,
  maxItems = 10,
  defaultValue = {},
  rules = {},
  ...props
}) => {
  const { fields, append, remove, error } = useFormArray(name, {
    defaultValue,
    rules,
  });

  const canAddMore = fields.length < maxItems;
  const canRemove = fields.length > minItems;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>{renderField(field, index, `${name}.${index}`)}</Box>

            {canRemove && (
              <Tooltip title={removeButtonText}>
                <IconButton onClick={() => remove(index)} color="error" size="small">
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Paper>
      ))}

      {canAddMore && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => append(defaultValue)}
          sx={{ mt: 1 }}
        >
          {addButtonText}
        </Button>
      )}

      <FieldError error={error?.message} />
    </Box>
  );
};

// Form Section Component
export const FormSection = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
  required = false,
  ...props
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Paper sx={{ p: 3, mb: 3 }} {...props}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="h3">
            {title}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {collapsible && <IconButton>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>}
      </Box>

      {(!collapsible || expanded) && (
        <>
          <Divider sx={{ mb: 2 }} />
          {children}
        </>
      )}
    </Paper>
  );
};

// Form Actions Component
export const FormActions = ({
  submitText = 'Simpan',
  cancelText = 'Batal',
  resetText = 'Reset',
  onCancel,
  onReset,
  showReset = true,
  showCancel = true,
  submitProps = {},
  cancelProps = {},
  resetProps = {},
  loading = false,
  disabled = false,
  ...props
}) => {
  const { formState } = useFormContext();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        pt: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
      {...props}
    >
      {showReset && (
        <Button
          type="button"
          variant="outlined"
          onClick={onReset}
          disabled={disabled || loading}
          {...resetProps}
        >
          {resetText}
        </Button>
      )}

      {showCancel && (
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={disabled || loading}
          {...cancelProps}
        >
          {cancelText}
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={disabled || loading || !formState.isValid}
        {...submitProps}
      >
        {loading ? 'Menyimpan...' : submitText}
      </Button>
    </Box>
  );
};

// Form Provider Wrapper
export const ValidatedForm = ({
  children,
  onSubmit,
  schema,
  defaultValues = {},
  mode = 'onChange',
  reValidateMode = 'onChange',
  ...props
}) => {
  const formMethods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
    mode,
    reValidateMode,
    ...props,
  });

  const handleSubmit = formMethods.handleSubmit(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormProvider>
  );
};

export default {
  ValidatedTextField,
  ValidatedSelectField,
  ValidatedAutocompleteField,
  ValidatedCheckboxGroup,
  ValidatedRadioGroup,
  ValidatedSwitch,
  ValidatedArrayField,
  FormSection,
  FormActions,
  ValidatedForm,
};
