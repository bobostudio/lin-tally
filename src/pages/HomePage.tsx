import React from "react";
import { MemphisNavbar, TransactionForm, TransactionList } from "@/components";
import { useStore } from "@/stores";
import { MemphisCard, MemphisModal } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

const HomePage: React.FC = () => {
  const { transactions, categories, deleteTransaction } = useStore();
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // 计算统计数据
  const stats = React.useMemo(() => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  // 处理编辑
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这条记录吗？")) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("删除失败:", error);
        alert("删除失败，请重试");
      }
    }
  };

  // 关闭编辑模态框
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="h-full flex flex-col">
      <MemphisNavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：记账表单 */}
            <div className="lg:col-span-1">
              <TransactionForm />
            </div>

            {/* 右侧：统计概览和最近记录 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MemphisCard className="text-center">
                  <div className="text-sm font-medium text-memphis-text-secondary mb-2">
                    本月收入
                  </div>
                  <div className="text-2xl font-bold text-memphis-accent-green">
                    {formatCurrency(stats.income)}
                  </div>
                </MemphisCard>

                <MemphisCard className="text-center">
                  <div className="text-sm font-medium text-memphis-text-secondary mb-2">
                    本月支出
                  </div>
                  <div className="text-2xl font-bold text-memphis-accent-magenta">
                    {formatCurrency(stats.expense)}
                  </div>
                </MemphisCard>

                <MemphisCard className="text-center">
                  <div className="text-sm font-medium text-memphis-text-secondary mb-2">
                    本月结余
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      stats.balance >= 0
                        ? "text-memphis-accent-green"
                        : "text-memphis-accent-magenta"
                    }`}
                  >
                    {formatCurrency(stats.balance)}
                  </div>
                </MemphisCard>
              </div>

              {/* 最近记录 */}
              <MemphisCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-memphis-text-primary">
                    最近记录
                  </h3>
                  <span className="text-sm text-memphis-text-muted">
                    共 {transactions.length} 条记录
                  </span>
                </div>

                <TransactionList
                  transactions={transactions.slice(0, 10)} // 只显示最近10条
                  categories={categories}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </MemphisCard>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑记录模态框 */}
      <MemphisModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="编辑记录"
      >
        <TransactionForm
          editingTransaction={editingTransaction}
          onSuccess={handleCloseEditModal}
          onClose={handleCloseEditModal}
        />
      </MemphisModal>
    </div>
  );
};

export default HomePage;
