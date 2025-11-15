import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind CSS类名
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成孟菲斯风格按钮类名
 * @param color - 按钮颜色
 * @param size - 按钮大小
 * @returns 按钮类名
 */
export function memphisButtonClass(color: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const baseClasses = 'font-bold border-memphis rounded-memphis shadow-memphis transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return cn(
    baseClasses,
    sizeClasses[size],
    `bg-${color} border-black text-white hover:bg-${color}-600`
  );
}

/**
 * 生成孟菲斯风格卡片类名
 * @param color - 卡片背景颜色
 * @returns 卡片类名
 */
export function memphisCardClass(color: string = 'white'): string {
  return cn(
    'rounded-memphis border-memphis shadow-memphis p-6 bg-white',
    'hover:shadow-memphis-lg transition-all duration-200 hover:-translate-y-1'
  );
}

/**
 * 生成孟菲斯风格输入框类名
 * @returns 输入框类名
 */
export function memphisInputClass(): string {
  return cn(
    'w-full px-4 py-3 border-memphis rounded-memphis shadow-memphis',
    'focus:outline-none focus:ring-4 focus:ring-memphis-primary-200',
    'bg-white text-gray-900 placeholder-gray-500'
  );
}

/**
 * 格式化日期
 * @param dateString - 日期字符串
 * @returns 格式化后的日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

/**
 * 格式化货币
 * @param amount - 金额
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 获取当前日期
 * @returns 当前日期字符串（YYYY-MM-DD）
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 计算日期范围
 * @param range - 日期范围类型
 * @param date - 基准日期
 * @returns 开始和结束日期
 */
export function getDateRange(range: 'day' | 'week' | 'month' | 'year', date: string): { start: string; end: string } {
  const currentDate = new Date(date);
  let start: Date;
  let end: Date;

  switch (range) {
    case 'day':
      start = new Date(currentDate);
      end = new Date(currentDate);
      break;
    case 'week':
      const dayOfWeek = currentDate.getDay();
      start = new Date(currentDate);
      start.setDate(currentDate.getDate() - dayOfWeek);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    case 'month':
      start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      break;
    case 'year':
      start = new Date(currentDate.getFullYear(), 0, 1);
      end = new Date(currentDate.getFullYear(), 11, 31);
      break;
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}
