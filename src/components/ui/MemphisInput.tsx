import React from 'react';
import { cn } from '@/lib/utils';

interface MemphisInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const MemphisInput: React.FC<MemphisInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  className,
  id,
  name,
  required = false,
  min,
  max,
  step,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      className={cn(
        'w-full px-4 py-3 border rounded-xl bg-memphis-background-surface',
        'focus:outline-none focus:ring-2 focus:ring-memphis-accent-cyan focus:border-memphis-accent-cyan',
        'text-memphis-text-primary placeholder-memphis-text-muted',
        'border-memphis-primary-700 hover:border-memphis-primary-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
    />
  );
};

export default MemphisInput;