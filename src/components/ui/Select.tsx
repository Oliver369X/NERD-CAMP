import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  helperText,
  error,
  options,
  fullWidth = true,
  onChange,
  ...props
}, ref) => {
  const id = props.id || props.name;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'block appearance-none w-full rounded-md shadow-sm border-neutral-300 bg-white',
            'focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10',
            'transition-colors duration-200',
            error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '',
            fullWidth && 'w-full',
            props.disabled && 'bg-neutral-100 cursor-not-allowed opacity-75'
          )}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown size={16} className="text-neutral-400" />
        </div>
      </div>
      
      {(helperText || error) && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-error-600' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;