import React from 'react';
import { cn } from '@/lib/utils';

interface MemphisTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  rows?: number;
}

const MemphisTextarea: React.FC<MemphisTextareaProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  className,
  id,
  name,
  required = false,
  rows = 4,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      rows={rows}
      className={cn(
        'w-full px-4 py-3 border rounded-xl bg-memphis-background-surface',
        'focus:outline-none focus:ring-2 focus:ring-memphis-accent-cyan focus:border-memphis-accent-cyan',
        'text-memphis-text-primary placeholder-memphis-text-muted resize-none',
        'border-memphis-primary-700 hover:border-memphis-primary-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
    />
  );
};

export default MemphisTextarea;