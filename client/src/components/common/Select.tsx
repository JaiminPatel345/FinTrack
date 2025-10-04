import React, { forwardRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], placeholder = 'Select an option', className = '', children, ...props }, ref) => {
    return (
      <label className="block text-sm">
        {label && <span className="label mb-1">{label}</span>}
        <select
          ref={ref}
          className={input appearance-none bg-white pr-10  }
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        {error && <span className="mt-1 block text-xs text-error">{error}</span>}
      </label>
    );
  }
);

Select.displayName = 'Select';
