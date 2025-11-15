// 记账记录类型
export interface Transaction {
  id: string;
  amount: number; // 金额（正数为收入，负数为支出）
  categoryId: string; // 分类ID
  date: string; // 日期 (YYYY-MM-DD)
  note: string; // 备注
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 分类类型
export interface Category {
  id: string;
  name: string; // 分类名称
  icon: string; // 图标名称（lucide图标）
  color: string; // 颜色（孟菲斯风格颜色）
  type: "income" | "expense"; // 分类类型
  isDefault: boolean; // 是否为默认分类
  createdAt: string; // 创建时间
}

// 统计数据类型
export interface Statistics {
  totalIncome: number; // 总收入
  totalExpense: number; // 总支出
  balance: number; // 结余
  byCategory: CategoryStatistics[]; // 按分类统计
}

// 分类统计类型
export interface CategoryStatistics {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number; // 正数为收入，负数为支出
  percentage: number; // 占比
}

// 日期范围类型
export type DateRange = "day" | "week" | "month" | "year";

// 同步状态类型
export type SyncStatus = "idle" | "syncing" | "synced" | "error";

// 搜索过滤类型
export interface SearchFilter {
  keyword?: string; // 搜索关键词（搜索备注）
  categoryId?: string; // 分类ID
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  type?: "income" | "expense"; // 收支类型
}

// 应用状态类型
export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  currentDate: string; // 当前选中的日期
  dateRange: DateRange;
  searchFilter: SearchFilter;
  isLoading: boolean;
  error: string | null;
  syncStatus: SyncStatus; // 同步状态

  // 交易记录相关操作
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>
  ) => void;
  deleteTransaction: (id: string) => void;

  // 分类相关操作
  addCategory: (
    category: Omit<Category, "id" | "createdAt" | "isDefault">
  ) => void;
  updateCategory: (
    id: string,
    updates: Partial<Omit<Category, "id" | "createdAt" | "isDefault">>
  ) => void;
  deleteCategory: (id: string) => void;

  // 日期和过滤相关操作
  setCurrentDate: (date: string) => void;
  setDateRange: (range: DateRange) => void;
  setSearchFilter: (filter: SearchFilter) => void;
  clearSearchFilter: () => void;

  // UI状态
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSyncStatus: (status: SyncStatus) => void;

  // 数据管理操作
  clearAllData: () => void;
}
