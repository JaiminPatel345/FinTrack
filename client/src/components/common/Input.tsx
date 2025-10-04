import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <label className="block text-sm">
        {label && <span className="label mb-1">{label}</span>}
        <motion.input
          ref={ref}
          whileFocus={{ scale: 1.005 }}
          className={input  }
          {...props}
        />
        {helperText && !error && (
          <span className="mt-1 text-xs text-neutral-500 block">{helperText}</span>
        )}
        {error && <span className="mt-1 block text-xs text-error">{error}</span>}
      </label>
    );
  }
);

Input.displayName = 'Input';
