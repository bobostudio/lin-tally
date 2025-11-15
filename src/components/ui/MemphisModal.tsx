import React from 'react';
import { X } from 'lucide-react';
import MemphisButton from './MemphisButton';

interface MemphisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const MemphisModal: React.FC<MemphisModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* 遮罩背景 */}
      <div 
        className="absolute inset-0 bg-memphis-primary-900 bg-opacity-80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className={`relative bg-memphis-background-card rounded-2xl border border-memphis-primary-700 ${sizeClasses[size]} w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100`}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-memphis-primary-700 bg-memphis-primary-800 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-memphis-text-primary">{title}</h2>
          <MemphisButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="!p-2"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-memphis-text-primary" />
          </MemphisButton>
        </div>
        
        {/* 内容区域 - 可滚动 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MemphisModal;