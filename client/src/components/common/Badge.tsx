import React from 'react';
import { classNames } from '@utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning-dark',
  danger: 'bg-error-light text-error',
  info: 'bg-primary-50 text-primary-600',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => (
  <span className={classNames('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', variantClasses[variant], className)}>
    {children}
  </span>
);
