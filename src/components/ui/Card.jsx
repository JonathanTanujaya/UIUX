import React from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles/designTokens';

export const Card = ({ children, padding = spacing[6], ...props }) => (
  <div
    style={{
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      border: `1px solid ${colors.gray[200]}`,
      padding,
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, ...props }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[200]}`,
      ...props.style,
    }}
    {...props}
  >
    <div>
      {title && (
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[900],
            margin: 0,
            marginBottom: subtitle ? spacing[1] : 0,
          }}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.gray[600],
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const CardFooter = ({ children, ...props }) => (
  <div
    style={{
      marginTop: spacing[4],
      paddingTop: spacing[4],
      borderTop: `1px solid ${colors.gray[200]}`,
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

export default Card;
