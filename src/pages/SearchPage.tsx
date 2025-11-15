import React from "react";
import { MemphisNavbar, TransactionList, TransactionForm } from "@/components";
import { useStore } from "@/stores";
import {
  MemphisCard,
  MemphisInput,
  MemphisButton,
  MemphisModal,
} from "@/components/ui";
import { Search, Filter, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

const SearchPage: React.FC = () => {
  const {
    transactions,
    categories,
    searchFilter,
    setSearchFilter,
    clearSearchFilter,
    deleteTransaction,
  } = useStore();

  const [localFilter, setLocalFilter] = React.useState({
    keyword: searchFilter.keyword || "",
    categoryId: searchFilter.categoryId || "",
    startDate: searchFilter.startDate || "",
    endDate: searchFilter.endDate || "",
    type: searchFilter.type || undefined,
  });

  const [showFilters, setShowFilters] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // 应用过滤条件
  const handleApplyFilters = () => {
    setSearchFilter(localFilter);
  };

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

  // 重置过滤条件
  const handleResetFilters = () => {
    setLocalFilter({
      keyword: "",
      categoryId: "",
      startDate: "",
      endDate: "",
      type: undefined,
    });
    clearSearchFilter();
  };

  // 过滤交易记录
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      // 关键词搜索（搜索备注）
      if (
        searchFilter.keyword &&
        !transaction.note
          .toLowerCase()
          .includes(searchFilter.keyword.toLowerCase())
      ) {
        return false;
      }

      // 分类过滤
      if (
        searchFilter.categoryId &&
        transaction.categoryId !== searchFilter.categoryId
      ) {
        return false;
      }

      // 日期范围过滤
      if (searchFilter.startDate && transaction.date < searchFilter.startDate) {
        return false;
      }
      if (searchFilter.endDate && transaction.date > searchFilter.endDate) {
        return false;
      }

      // 收支类型过滤
      if (searchFilter.type) {
        const category = categories.find(
          (c) => c.id === transaction.categoryId
        );
        if (category && category.type !== searchFilter.type) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, searchFilter, categories]);

  // 计算搜索结果统计
  const searchStats = React.useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      count: filteredTransactions.length,
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  return (
    <div className="h-full flex flex-col">
      <MemphisNavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 搜索头部 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-6">
              搜索记录
            </h1>

            {/* 搜索栏 */}
            <MemphisCard>
              <div className="space-y-4">
                {/* 主要搜索 */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <MemphisInput
                      type="text"
                      placeholder="搜索备注内容..."
                      value={localFilter.keyword}
                      onChange={(e) =>
                        setLocalFilter({
                          ...localFilter,
                          keyword: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                  <MemphisButton
                    variant="secondary"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    高级筛选
                  </MemphisButton>
                  <MemphisButton variant="primary" onClick={handleApplyFilters}>
                    搜索
                  </MemphisButton>
                </div>

                {/* 高级筛选 */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 分类选择 */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          分类
                        </label>
                        <select
                          value={localFilter.categoryId}
                          onChange={(e) =>
                            setLocalFilter({
                              ...localFilter,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-200 bg-white text-gray-900"
                        >
                          <option value="">所有分类</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 收支类型 */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          类型
                        </label>
                        <select
                          value={localFilter.type}
                          onChange={(e) =>
                            setLocalFilter({
                              ...localFilter,
                              type: e.target.value as
                                | "income"
                                | "expense"
                                | undefined,
                            })
                          }
                          className="w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-200 bg-white text-gray-900"
                        >
                          <option value="">全部</option>
                          <option value="income">收入</option>
                          <option value="expense">支出</option>
                        </select>
                      </div>

                      {/* 开始日期 */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          开始日期
                        </label>
                        <MemphisInput
                          type="date"
                          value={localFilter.startDate}
                          onChange={(e) =>
                            setLocalFilter({
                              ...localFilter,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* 结束日期 */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          结束日期
                        </label>
                        <MemphisInput
                          type="date"
                          value={localFilter.endDate}
                          onChange={(e) =>
                            setLocalFilter({
                              ...localFilter,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* 重置按钮 */}
                    <div className="flex justify-end">
                      <MemphisButton
                        variant="danger"
                        size="sm"
                        onClick={handleResetFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        重置筛选
                      </MemphisButton>
                    </div>
                  </div>
                )}
              </div>
            </MemphisCard>
          </div>

          {/* 搜索结果统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MemphisCard className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {searchStats.count}
              </div>
              <div className="text-sm text-gray-600">找到记录</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(searchStats.income)}
              </div>
              <div className="text-sm text-gray-600">收入总额</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {formatCurrency(searchStats.expense)}
              </div>
              <div className="text-sm text-gray-600">支出总额</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div
                className={`text-2xl font-bold ${
                  searchStats.balance >= 0 ? "text-green-600" : "text-pink-600"
                }`}
              >
                {formatCurrency(searchStats.balance)}
              </div>
              <div className="text-sm text-gray-600">净收支</div>
            </MemphisCard>
          </div>

          {/* 搜索结果列表 */}
          <MemphisCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-display">
                搜索结果
              </h3>
              <span className="text-sm text-gray-500">
                共 {filteredTransactions.length} 条记录
              </span>
            </div>

            <TransactionList
              transactions={filteredTransactions}
              categories={categories}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </MemphisCard>
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

export default SearchPage;
