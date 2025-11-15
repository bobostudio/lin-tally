import React from 'react';
import { cn } from '@/lib/utils';

interface MemphisButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const MemphisButton: React.FC<MemphisButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}) => {
  const baseClasses = cn(
    'font-bold border-2 rounded-xl transition-all duration-200',
    'hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1',
    'focus:outline-none focus:ring-4 focus:ring-opacity-50',
    disabled && 'opacity-50 cursor-not-allowed hover:transform-none active:transform-none'
  );

  const variantClasses = {
    primary: 'bg-memphis-primary-800 border-memphis-primary-600 text-memphis-text-primary hover:bg-memphis-primary-700 hover:border-memphis-accent-cyan focus:ring-memphis-accent-cyan',
    secondary: 'bg-memphis-primary-700 border-memphis-primary-600 text-memphis-text-primary hover:bg-memphis-primary-600 hover:border-memphis-accent-magenta focus:ring-memphis-accent-magenta',
    danger: 'bg-memphis-primary-800 border-memphis-accent-magenta text-memphis-text-primary hover:bg-memphis-primary-700 focus:ring-memphis-accent-magenta',
    success: 'bg-memphis-primary-700 border-memphis-accent-green text-memphis-text-primary hover:bg-memphis-primary-600 focus:ring-memphis-accent-green',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

export default MemphisButton;