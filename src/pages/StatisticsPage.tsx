import React from "react";
import { MemphisNavbar } from "@/components";
import { useStore } from "@/stores";
import { MemphisCard, MemphisButton } from "@/components/ui";
import { formatCurrency, getDateRange } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Car,
  Home,
  Heart,
  Book,
  Gamepad2,
  Utensils,
  MoreHorizontal,
  Gift,
  Plus,
} from "lucide-react";

const StatisticsPage: React.FC = () => {
  const { transactions, categories, currentDate, dateRange } = useStore();

  // 获取日期范围
  const dateRangeData = React.useMemo(() => {
    return getDateRange(dateRange, currentDate);
  }, [dateRange, currentDate]);

  // 过滤当前日期范围的交易
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(
      (t) => t.date >= dateRangeData.start && t.date <= dateRangeData.end
    );
  }, [transactions, dateRangeData]);

  // 计算统计数据
  const stats = React.useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryStats = categories
      .map((category) => {
        const categoryTransactions = filteredTransactions.filter(
          (t) => t.categoryId === category.id
        );
        const categoryAmount = categoryTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return {
          name: category.name,
          value: categoryAmount,
          color: category.color,
          icon: category.icon,
          count: categoryTransactions.length,
        };
      })
      .filter((stat) => stat.value > 0);

    // 日趋势数据
    const dailyData = [];
    const startDate = new Date(dateRangeData.start);
    const endDate = new Date(dateRangeData.end);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const dayTransactions = filteredTransactions.filter(
        (t) => t.date === dateStr
      );
      const dayIncome = dayTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpense = dayTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      dailyData.push({
        date: dateStr,
        income: dayIncome,
        expense: dayExpense,
        balance: dayIncome - dayExpense,
      });
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      categoryStats,
      dailyData,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, categories, dateRangeData]);

  // 图标映射
  const iconMap: Record<string, any> = {
    Utensils,
    ShoppingBag,
    Car,
    Home,
    Heart,
    Book,
    Gamepad2,
    MoreHorizontal,
    DollarSign,
    Gift,
    TrendingUp,
    Plus,
  };

  // 日期范围选项
  const dateRangeOptions = [
    { value: "day", label: "日" },
    { value: "week", label: "周" },
    { value: "month", label: "月" },
    { value: "year", label: "年" },
  ];

  return (
    <div className="h-full flex flex-col">
      <MemphisNavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              数据统计
            </h1>
            <div className="flex space-x-2">
              {dateRangeOptions.map((option) => (
                <MemphisButton
                  key={option.value}
                  variant={dateRange === option.value ? "primary" : "secondary"}
                  size="sm"
                  onClick={() =>
                    useStore.getState().setDateRange(option.value as any)
                  }
                >
                  {option.label}
                </MemphisButton>
              ))}
            </div>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MemphisCard className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </div>
              <div className="text-sm text-gray-600">总收入</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ShoppingBag className="h-8 w-8 text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-pink-600">
                {formatCurrency(stats.totalExpense)}
              </div>
              <div className="text-sm text-gray-600">总支出</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp
                  className={`h-8 w-8 ${
                    stats.balance >= 0 ? "text-green-500" : "text-pink-500"
                  }`}
                />
              </div>
              <div
                className={`text-2xl font-bold ${
                  stats.balance >= 0 ? "text-green-600" : "text-pink-600"
                }`}
              >
                {formatCurrency(stats.balance)}
              </div>
              <div className="text-sm text-gray-600">结余</div>
            </MemphisCard>

            <MemphisCard className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.transactionCount}
              </div>
              <div className="text-sm text-gray-600">交易笔数</div>
            </MemphisCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 分类支出饼图 */}
            <MemphisCard>
              <h3 className="text-xl font-bold text-gray-900 font-display mb-4">
                支出分类
              </h3>
              {stats.categoryStats.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <p>暂无支出数据</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${formatCurrency(value)}`
                      }
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </MemphisCard>

            {/* 分类支出柱状图 */}
            <MemphisCard>
              <h3 className="text-xl font-bold text-gray-900 font-display mb-4">
                分类支出排行
              </h3>
              {stats.categoryStats.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <p>暂无支出数据</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categoryStats.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar dataKey="value" fill="#8884d8">
                      {stats.categoryStats.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </MemphisCard>

            {/* 收支趋势折线图 */}
            <MemphisCard className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 font-display mb-4">
                收支趋势
              </h3>
              {stats.dailyData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📈</div>
                  <p>暂无数据</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).getDate().toString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("zh-CN")
                      }
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name === "income" ? "收入" : "支出",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#ec4899"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </MemphisCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
