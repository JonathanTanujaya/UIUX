import React from 'react';
import { colors, spacing, borderRadius, typography, components } from '../../styles/designTokens';

export const Input = ({
  label,
  error,
  helperText,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <div style={{ marginBottom: spacing[4], width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing[2],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.gray[700],
          }}
          htmlFor={props.id || props.name}
        >
          {label}
          {props.required && <span style={{ color: colors.error[500], marginLeft: spacing[1] }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && iconPosition === 'left' && (
          <div
            style={{
              position: 'absolute',
              left: spacing[3],
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.gray[400],
              display: 'flex',
            }}
          >
            {icon}
          </div>
        )}
        
        <input
          style={{
            width: '100%',
            height: components.input.height,
            padding: icon ? (iconPosition === 'left' ? `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[10]}` : `${spacing[2]} ${spacing[10]} ${spacing[2]} ${spacing[3]}`) : components.input.padding,
            fontSize: typography.fontSize.sm,
            fontFamily: typography.fontFamily.sans,
            color: colors.gray[900],
            backgroundColor: colors.white,
            border: `1px solid ${error ? colors.error[500] : colors.gray[300]}`,
            borderRadius: borderRadius.md,
            outline: 'none',
            transition: 'border-color 150ms',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? colors.error[500] : colors.primary[600];
            e.target.style.boxShadow = `0 0 0 3px ${error ? colors.error[100] : colors.primary[100]}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? colors.error[500] : colors.gray[300];
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div
            style={{
              position: 'absolute',
              right: spacing[3],
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.gray[400],
              display: 'flex',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p
          style={{
            marginTop: spacing[1],
            fontSize: typography.fontSize.xs,
            color: error ? colors.error[600] : colors.gray[600],
            margin: `${spacing[1]} 0 0 0`,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const Select = ({ label, error, helperText, fullWidth = true, options = [], ...props }) => {
  return (
    <div style={{ marginBottom: spacing[4], width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing[2],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.gray[700],
          }}
          htmlFor={props.id || props.name}
        >
          {label}
          {props.required && <span style={{ color: colors.error[500], marginLeft: spacing[1] }}>*</span>}
        </label>
      )}
      
      <select
        style={{
          width: '100%',
          height: components.input.height,
          padding: components.input.padding,
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.sans,
          color: colors.gray[900],
          backgroundColor: colors.white,
          border: `1px solid ${error ? colors.error[500] : colors.gray[300]}`,
          borderRadius: borderRadius.md,
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? colors.error[500] : colors.primary[600];
          e.target.style.boxShadow = `0 0 0 3px ${error ? colors.error[100] : colors.primary[100]}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.error[500] : colors.gray[300];
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <p
          style={{
            marginTop: spacing[1],
            fontSize: typography.fontSize.xs,
            color: error ? colors.error[600] : colors.gray[600],
            margin: `${spacing[1]} 0 0 0`,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const Textarea = ({ label, error, helperText, fullWidth = true, rows = 4, ...props }) => {
  return (
    <div style={{ marginBottom: spacing[4], width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: spacing[2],
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.gray[700],
          }}
          htmlFor={props.id || props.name}
        >
          {label}
          {props.required && <span style={{ color: colors.error[500], marginLeft: spacing[1] }}>*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        style={{
          width: '100%',
          padding: components.input.padding,
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.sans,
          color: colors.gray[900],
          backgroundColor: colors.white,
          border: `1px solid ${error ? colors.error[500] : colors.gray[300]}`,
          borderRadius: borderRadius.md,
          outline: 'none',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? colors.error[500] : colors.primary[600];
          e.target.style.boxShadow = `0 0 0 3px ${error ? colors.error[100] : colors.primary[100]}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.error[500] : colors.gray[300];
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      
      {(error || helperText) && (
        <p
          style={{
            marginTop: spacing[1],
            fontSize: typography.fontSize.xs,
            color: error ? colors.error[600] : colors.gray[600],
            margin: `${spacing[1]} 0 0 0`,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
