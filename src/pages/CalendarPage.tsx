import React from "react";
import { MemphisNavbar, TransactionList, TransactionForm } from "@/components";
import { useStore } from "@/stores";
import { MemphisCard, MemphisButton, MemphisModal } from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const CalendarPage: React.FC = () => {
  const { transactions, categories, setCurrentDate, currentDate } = useStore();
  const [selectedDate, setSelectedDate] = React.useState<string>(currentDate);
  const [showTransactionForm, setShowTransactionForm] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<any>(null);

  // 获取当前月份的数据
  const currentMonth = React.useMemo(() => {
    const date = new Date(currentDate);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  }, [currentDate]);

  // 生成日历数据
  const calendarDays = React.useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        isCurrentMonth: date.getMonth() === month,
        isToday:
          date.toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0],
      });
    }
    return days;
  }, [currentMonth]);

  // 获取某天的交易记录
  const getTransactionsByDate = (date: string) => {
    return transactions.filter((t) => t.date === date);
  };

  // 获取某天的收支统计
  const getDayStats = (date: string) => {
    const dayTransactions = getTransactionsByDate(date);
    const income = dayTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expense, count: dayTransactions.length };
  };

  // 切换月份
  const changeMonth = (direction: "prev" | "next") => {
    const date = new Date(currentDate);
    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const newDate = date.toISOString().split("T")[0];
    setCurrentDate(newDate);
  };

  // 选择日期
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowTransactionForm(true);
    setEditingTransaction(null);
  };

  // 处理添加交易
  const handleAddTransaction = () => {
    setShowTransactionForm(true);
    setEditingTransaction(null);
  };

  // 处理编辑交易
  const handleEditTransaction = (transaction: any) => {
    setShowTransactionForm(true);
    setEditingTransaction(transaction);
  };

  // 处理删除交易
  const handleDeleteTransaction = async (id: string) => {
    if (confirm("确定要删除这条记录吗？")) {
      try {
        const { deleteTransaction } = useStore.getState();
        await deleteTransaction(id);
      } catch (error) {
        console.error("删除失败:", error);
        alert("删除失败，请重试");
      }
    }
  };

  // 关闭表单
  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const selectedTransactions = getTransactionsByDate(selectedDate);
  const selectedDayStats = getDayStats(selectedDate);

  return (
    <div className="h-full flex flex-col">
      <MemphisNavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 日历 */}
            <div className="lg:col-span-3">
              <MemphisCard>
                {/* 日历头部 */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-memphis-text-primary font-display">
                    {currentMonth.year}年{currentMonth.month + 1}月
                  </h2>
                  <div className="flex space-x-2">
                    <MemphisButton
                      variant="secondary"
                      size="sm"
                      onClick={() => changeMonth("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </MemphisButton>
                    <MemphisButton
                      variant="secondary"
                      size="sm"
                      onClick={() => changeMonth("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </MemphisButton>
                  </div>
                </div>

                {/* 星期标题 */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-memphis-text-secondary py-2 text-sm"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日历格子 */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const stats = getDayStats(day.date);
                    const isSelected = day.date === selectedDate;

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day.date)}
                        className={`
                        relative p-2 text-center cursor-pointer rounded-lg border transition-all duration-200 min-h-[80px] flex flex-col justify-between
                        ${
                          day.isCurrentMonth
                            ? "text-memphis-text-primary"
                            : "text-memphis-text-muted opacity-50"
                        }
                        ${
                          isSelected
                            ? "bg-memphis-primary-700 border-memphis-accent-cyan shadow-lg scale-105"
                            : "border-memphis-primary-700 hover:bg-memphis-primary-800 hover:border-memphis-primary-600"
                        }
                        ${
                          day.isToday
                            ? "ring-2 ring-memphis-accent-cyan ring-offset-2 ring-offset-memphis-background-primary"
                            : ""
                        }
                      `}
                      >
                        <div className="text-sm font-bold">
                          {new Date(day.date).getDate()}
                        </div>
                        {stats.count > 0 && (
                          <div className="space-y-0.5 text-xs">
                            {stats.income > 0 && (
                              <div className="text-memphis-accent-green font-medium truncate">
                                +{formatCurrency(stats.income)}
                              </div>
                            )}
                            {stats.expense > 0 && (
                              <div className="text-memphis-accent-magenta font-medium truncate">
                                -{formatCurrency(stats.expense)}
                              </div>
                            )}
                          </div>
                        )}
                        {stats.count > 0 && (
                          <div className="absolute top-1 right-1">
                            <div className="w-1.5 h-1.5 bg-memphis-accent-cyan rounded-full"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </MemphisCard>
            </div>

            {/* 右侧区域：选中日期详情 */}
            <div className="lg:col-span-2">
              <MemphisCard className="sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-memphis-text-primary font-display">
                      {formatDate(selectedDate)}
                    </h3>
                    <p className="text-xs text-memphis-text-muted mt-0.5">
                      {selectedTransactions.length} 条记录
                    </p>
                  </div>
                  <MemphisButton
                    variant="primary"
                    size="sm"
                    onClick={handleAddTransaction}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                  </MemphisButton>
                </div>

                {/* 日统计 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-memphis-primary-800 rounded-lg border border-memphis-accent-green/30">
                    <div className="text-xs text-memphis-accent-green font-medium mb-1">
                      收入
                    </div>
                    <div className="text-lg font-bold text-memphis-accent-green">
                      {formatCurrency(selectedDayStats.income)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-memphis-primary-800 rounded-lg border border-memphis-accent-magenta/30">
                    <div className="text-xs text-memphis-accent-magenta font-medium mb-1">
                      支出
                    </div>
                    <div className="text-lg font-bold text-memphis-accent-magenta">
                      {formatCurrency(selectedDayStats.expense)}
                    </div>
                  </div>
                </div>

                {/* 交易记录 */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {selectedTransactions.length === 0 ? (
                    <div className="text-center py-12 text-memphis-text-muted">
                      <div className="text-5xl mb-3">📅</div>
                      <p className="font-medium text-base">
                        这一天还没有记账记录
                      </p>
                      <p className="text-sm mt-2 text-memphis-text-muted">
                        点击上方添加按钮开始记录
                      </p>
                    </div>
                  ) : (
                    <TransactionList
                      transactions={selectedTransactions}
                      categories={categories}
                      showActions={true}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  )}
                </div>
              </MemphisCard>
            </div>
          </div>
        </div>
      </div>

      {/* 模态框：交易表单 */}
      <MemphisModal
        isOpen={showTransactionForm}
        onClose={handleCloseForm}
        title={editingTransaction ? "编辑记账" : "添加记账"}
        size="md"
      >
        <TransactionForm
          selectedDate={selectedDate}
          editingTransaction={editingTransaction}
          onClose={handleCloseForm}
        />
      </MemphisModal>
    </div>
  );
};

export default CalendarPage;
