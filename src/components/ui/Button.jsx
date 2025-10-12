import React from 'react';
import { colors, spacing, borderRadius, transitions, typography, components } from '../../styles/designTokens';

const variantStyles = {
  primary: {
    base: {
      backgroundColor: colors.primary[600],
      color: colors.white,
      border: 'none',
    },
    hover: {
      backgroundColor: colors.primary[700],
    },
    active: {
      backgroundColor: colors.primary[800],
    },
  },
  secondary: {
    base: {
      backgroundColor: colors.white,
      color: colors.gray[700],
      border: `1px solid ${colors.gray[300]}`,
    },
    hover: {
      backgroundColor: colors.gray[50],
      borderColor: colors.gray[400],
    },
    active: {
      backgroundColor: colors.gray[100],
    },
  },
  success: {
    base: {
      backgroundColor: colors.success[600],
      color: colors.white,
      border: 'none',
    },
    hover: {
      backgroundColor: colors.success[700],
    },
  },
  danger: {
    base: {
      backgroundColor: colors.error[600],
      color: colors.white,
      border: 'none',
    },
    hover: {
      backgroundColor: colors.error[700],
    },
  },
  ghost: {
    base: {
      backgroundColor: 'transparent',
      color: colors.gray[700],
      border: 'none',
    },
    hover: {
      backgroundColor: colors.gray[100],
    },
  },
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const baseStyle = variantStyles[variant]?.base || variantStyles.primary.base;
  const hoverStyle = variantStyles[variant]?.hover || {};
  const activeStyle = variantStyles[variant]?.active || {};

  const sizeStyles = {
    sm: {
      height: components.button.height.sm,
      padding: components.button.padding.sm,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: components.button.height.md,
      padding: components.button.padding.md,
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: components.button.height.lg,
      padding: components.button.padding.lg,
      fontSize: typography.fontSize.base,
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        fontFamily: typography.fontFamily.sans,
        fontWeight: typography.fontWeight.medium,
        borderRadius: borderRadius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: `all ${transitions.fast}`,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        ...baseStyle,
        ...sizeStyles[size],
        ...(isHovered && !disabled ? hoverStyle : {}),
        ...(isActive && !disabled ? activeStyle : {}),
        ...props.style,
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'flex', alignItems: 'center', fontStyle: 'normal' }}>{icon}</span>}
      <span style={{ fontStyle: 'normal' }}>{children}</span>
      {icon && iconPosition === 'right' && <span style={{ display: 'flex', alignItems: 'center', fontStyle: 'normal' }}>{icon}</span>}
    </button>
  );
};

export default Button;
