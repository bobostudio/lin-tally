import React from 'react';
import { cn } from '@/lib/utils';

interface MemphisCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const MemphisCard: React.FC<MemphisCardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-memphis-primary-700 bg-memphis-background-card',
        paddingClasses[padding],
        hover && 'hover:border-memphis-accent-cyan hover:shadow-memphis-md transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MemphisCard;