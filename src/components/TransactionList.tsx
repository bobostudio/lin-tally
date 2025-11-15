import React from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, Category } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  }, [categories]);

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-memphis-text-secondary text-6xl mb-4">📊</div>
        <p className="text-memphis-text-secondary text-lg">暂无记账记录</p>
        <p className="text-memphis-text-muted text-sm mt-2">开始记录您的第一笔收支吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => {
        const category = categoryMap.get(transaction.categoryId);
        const isIncome = transaction.amount > 0;
        
        return (
          <div
            key={transaction.id}
            className="bg-memphis-background-card rounded-xl border border-memphis-primary-700 hover:border-memphis-accent-cyan hover:shadow-memphis-md transition-all duration-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* 分类图标 */}
                {category && (
                  <div
                    className="w-12 h-12 rounded-xl border border-memphis-primary-600 flex items-center justify-center text-memphis-text-primary font-medium"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-memphis-text-primary">
                      {category?.name || '未知分类'}
                    </span>
                    <span className="text-sm text-memphis-text-muted">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  {transaction.note && (
                    <p className="text-sm text-memphis-text-secondary mt-1">{transaction.note}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* 金额 */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isIncome ? 'text-memphis-accent-green' : 'text-memphis-accent-magenta'
                  }`}>
                    {isIncome ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>

                {/* 操作按钮 */}
                {showActions && (
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-memphis-text-muted hover:text-memphis-text-primary hover:bg-memphis-primary-800 rounded-xl transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-memphis-text-muted hover:text-memphis-accent-magenta hover:bg-memphis-primary-800 rounded-xl transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;