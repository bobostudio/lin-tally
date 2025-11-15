import React from 'react';
import { MemphisCard, MemphisInput, MemphisTextarea, MemphisButton } from '@/components/ui';
import { Category, Transaction } from '@/types';
import { useStore } from '@/stores';
import { formatCurrency, getCurrentDate, generateId } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Transaction>;
  selectedDate?: string;
  editingTransaction?: Transaction | null;
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, initialData, selectedDate, editingTransaction, onClose }) => {
  const { categories, addTransaction, updateTransaction } = useStore();
  
  const [formData, setFormData] = React.useState(() => {
    const initialAmount = editingTransaction?.amount || initialData?.amount;
    const initialCategoryId = editingTransaction?.categoryId || initialData?.categoryId;
    const initialDate = editingTransaction?.date || initialData?.date || selectedDate || getCurrentDate();
    const initialNote = editingTransaction?.note || initialData?.note || '';
    const initialType = initialAmount ? (initialAmount > 0 ? 'income' : 'expense') : 'expense';
    
    return {
      amount: initialAmount?.toString() || '',
      categoryId: initialCategoryId || categories.find(c => c.type === 'expense')?.id || '',
      date: initialDate,
      note: initialNote,
      type: initialType,
    };
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    setIsSubmitting(true);
    try {
      const amount = parseFloat(formData.amount);
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
      
      const transactionData = {
        amount: finalAmount,
        categoryId: formData.categoryId,
        date: formData.date,
        note: formData.note,
      };

      if (editingTransaction?.id) {
        updateTransaction(editingTransaction.id, transactionData);
      } else if (initialData?.id) {
        updateTransaction(initialData.id, transactionData);
      } else {
        addTransaction(transactionData);
      }

      onSuccess?.();
      onClose?.();
      
      // 重置表单
      if (!editingTransaction && !initialData) {
        setFormData({
          amount: '',
          categoryId: categories.find(c => c.type === 'expense')?.id || '',
          date: selectedDate || getCurrentDate(),
          note: '',
          type: 'expense',
        });
      }
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    const category = categories.find(c => c.type === type);
    setFormData({
      ...formData,
      type,
      categoryId: category?.id || '',
    });
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);
  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <MemphisCard className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 收支类型选择 */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-medium transition-all ${
              formData.type === 'income'
                ? 'bg-memphis-primary-700 border-memphis-accent-green text-memphis-accent-green'
                : 'bg-memphis-primary-800 border-memphis-primary-700 text-memphis-text-secondary hover:border-memphis-accent-green hover:text-memphis-accent-green'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>收入</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-medium transition-all ${
              formData.type === 'expense'
                ? 'bg-memphis-primary-700 border-memphis-accent-magenta text-memphis-accent-magenta'
                : 'bg-memphis-primary-800 border-memphis-primary-700 text-memphis-text-secondary hover:border-memphis-accent-magenta hover:text-memphis-accent-magenta'
            }`}
          >
            <Minus className="h-5 w-5" />
            <span>支出</span>
          </button>
        </div>

        {/* 金额输入 */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-memphis-text-secondary mb-2">
            金额
          </label>
          <MemphisInput
            id="amount"
            type="number"
            placeholder="请输入金额"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* 分类选择 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-memphis-text-secondary mb-2">
            分类
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl bg-memphis-background-surface border-memphis-primary-700 text-memphis-text-primary focus:outline-none focus:ring-2 focus:ring-memphis-accent-cyan focus:border-memphis-accent-cyan"
            required
          >
            <option value="">请选择分类</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 日期选择 */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-memphis-text-secondary mb-2">
            日期
          </label>
          <MemphisInput
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* 备注 */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-memphis-text-secondary mb-2">
            备注（可选）
          </label>
          <MemphisTextarea
            id="note"
            placeholder="添加备注信息..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        {/* 提交按钮 */}
        <MemphisButton
          type="submit"
          disabled={isSubmitting || !formData.amount || !formData.categoryId}
          className="w-full"
        >
          {isSubmitting ? '提交中...' : (editingTransaction || initialData ? '更新记录' : '添加记录')}
        </MemphisButton>
      </form>
    </MemphisCard>
  );
};

export default TransactionForm;