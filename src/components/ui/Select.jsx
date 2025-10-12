import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/designTokens';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  disabled = false, 
  helperText,
  children,
  fullWidth = false,
  ...props 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: spacing[1],
      width: fullWidth ? '100%' : 'auto'
    }}>
      {label && (
        <label 
          htmlFor={name}
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.gray[700],
            fontStyle: 'normal'
          }}
        >
          {label}
          {required && <span style={{ color: colors.error[500], marginLeft: spacing[1] }}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{
          padding: `${spacing[2]} ${spacing[3]}`,
          fontSize: typography.fontSize.sm,
          border: `1px solid ${colors.gray[300]}`,
          borderRadius: borderRadius.md,
          backgroundColor: disabled ? colors.gray[100] : colors.white,
          color: colors.gray[900],
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          outline: 'none',
          fontFamily: typography.fontFamily.sans,
          fontStyle: 'normal',
          width: '100%',
          ...props.style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary[500];
          e.target.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.gray[300];
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      >
        {children}
      </select>
      {helperText && (
        <span style={{
          fontSize: typography.fontSize.xs,
          color: colors.gray[500],
          fontStyle: 'normal'
        }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Select;
