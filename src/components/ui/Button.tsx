import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  iconPosition = 'left',
  fullWidth,
  ...props
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3'
  };

  // Define variant classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white border border-transparent',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white border border-transparent',
    outline: 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-700 hover:text-neutral-900 border',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-transparent',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 underline hover:underline-offset-4 p-0 border-none shadow-none',
    danger: 'bg-error-600 hover:bg-error-700 focus:ring-error-500 text-white border border-transparent'
  };

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-all duration-200 ease-in-out',
        'active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
        // Disabled & loading styles
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        // Size
        sizeClasses[size],
        // Variant
        variantClasses[variant],
        // Full width
        fullWidth && 'w-full',
        // Custom classes
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;