import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  as?: 'input' | 'textarea';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  helperText,
  error,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  as = 'input',
  ...props
}, ref) => {
  const id = props.id || props.name;

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
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            {icon}
          </div>
        )}
        
        {as === 'textarea' ? (
          <textarea
            id={id}
            className={cn(
              'block rounded-md shadow-sm border-neutral-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
              'transition-colors duration-200',
              error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '',
              icon && iconPosition === 'left' ? 'pl-10' : '',
              icon && iconPosition === 'right' ? 'pr-10' : '',
              fullWidth && 'w-full',
              props.disabled && 'bg-neutral-100 cursor-not-allowed opacity-75',
              className
            )}
            {...props}
          />
        ) : (
          <input
          ref={ref}
          id={id}
          className={cn(
            'block rounded-md shadow-sm border-neutral-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
            'transition-colors duration-200',
            error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '',
            icon && iconPosition === 'left' ? 'pl-10' : '',
            icon && iconPosition === 'right' ? 'pr-10' : '',
            fullWidth && 'w-full',
            props.disabled && 'bg-neutral-100 cursor-not-allowed opacity-75'
          )}
          {...props}
          />
        )}
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-500">
            {icon}
          </div>
        )}
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

Input.displayName = 'Input';

export default Input;