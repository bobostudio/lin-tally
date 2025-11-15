import { create } from "zustand";
import {
  Transaction,
  Category,
  AppState,
  SearchFilter,
  DateRange,
} from "@/types";
import { getCurrentDate, generateId } from "@/lib/utils";
import { transactionService, categoryService } from "@/lib/supabaseService";

// 初始状态
const initialState = {
  transactions: [],
  categories: [],
  currentDate: getCurrentDate(),
  dateRange: "month" as DateRange,
  searchFilter: {},
  isLoading: false,
  error: null,
  syncStatus: "idle" as const,
};

// 创建 Supabase 集成的状态存储
export const useSupabaseStore = create<AppState>((set, get) => ({
  ...initialState,

  // 交易记录相关操作
  addTransaction: async (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      set({ syncStatus: "syncing" });

      const newTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = await transactionService.create(newTransaction);

      set((state) => ({
        transactions: [...state.transactions, created],
        syncStatus: "synced",
      }));

      // 2秒后恢复为 idle 状态
      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "添加交易记录失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  updateTransaction: async (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>
  ) => {
    try {
      set({ syncStatus: "syncing" });

      const updated = await transactionService.update(id, updates);

      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? updated : transaction
        ),
        syncStatus: "synced",
      }));

      // 2秒后恢复为 idle 状态
      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "更新交易记录失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      set({ syncStatus: "syncing" });

      await transactionService.delete(id);

      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id
        ),
        syncStatus: "synced",
      }));

      // 2秒后恢复为 idle 状态
      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "删除交易记录失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  // 分类相关操作
  addCategory: async (
    category: Omit<Category, "id" | "createdAt" | "isDefault">
  ) => {
    try {
      set({ syncStatus: "syncing" });

      const newCategory: Category = {
        ...category,
        id: generateId(),
        isDefault: false,
        createdAt: new Date().toISOString(),
      };

      const created = await categoryService.create(newCategory);

      set((state) => ({
        categories: [...state.categories, created],
        syncStatus: "synced",
      }));

      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "添加分类失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  updateCategory: async (
    id: string,
    updates: Partial<Omit<Category, "id" | "createdAt" | "isDefault">>
  ) => {
    try {
      set({ syncStatus: "syncing" });

      const updated = await categoryService.update(id, updates);

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updated : category
        ),
        syncStatus: "synced",
      }));

      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "更新分类失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ syncStatus: "syncing" });

      await categoryService.delete(id);

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        syncStatus: "synced",
      }));

      setTimeout(() => set({ syncStatus: "idle" }), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "删除分类失败";
      console.error(errorMessage, error);
      set({ syncStatus: "error" });
      setTimeout(() => set({ syncStatus: "idle" }), 3000);
      throw error;
    }
  },

  // 日期和过滤相关操作
  setCurrentDate: (date: string) => {
    set({ currentDate: date });
  },

  setDateRange: (range: DateRange) => {
    set({ dateRange: range });
  },

  setSearchFilter: (filter: SearchFilter) => {
    set({ searchFilter: filter });
  },

  clearSearchFilter: () => {
    set({ searchFilter: {} });
  },

  // UI状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setSyncStatus: (status) => {
    set({ syncStatus: status });
  },

  // 数据管理操作
  clearAllData: async () => {
    try {
      set({ isLoading: true, error: null });

      await transactionService.deleteAll();

      set({
        transactions: [],
        currentDate: getCurrentDate(),
        dateRange: "month",
        searchFilter: {},
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "清空数据失败";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));

// 初始化数据加载
export const initializeSupabaseStore = async () => {
  try {
    useSupabaseStore.setState({ isLoading: true, error: null });

    const [transactions, categories] = await Promise.all([
      transactionService.getAll(),
      categoryService.getAll(),
    ]);

    useSupabaseStore.setState({
      transactions,
      categories,
      isLoading: false,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "加载数据失败";
    useSupabaseStore.setState({ error: errorMessage, isLoading: false });
    throw error;
  }
};

// 选择器函数
export const useTransactions = () =>
  useSupabaseStore((state) => state.transactions);
export const useCategories = () =>
  useSupabaseStore((state) => state.categories);
export const useCurrentDate = () =>
  useSupabaseStore((state) => state.currentDate);
export const useDateRange = () => useSupabaseStore((state) => state.dateRange);
export const useSearchFilter = () =>
  useSupabaseStore((state) => state.searchFilter);
export const useLoading = () => useSupabaseStore((state) => state.isLoading);
export const useError = () => useSupabaseStore((state) => state.error);
export const useSyncStatus = () =>
  useSupabaseStore((state) => state.syncStatus);

// 获取过滤后的交易记录
export const useFilteredTransactions = () => {
  return useSupabaseStore((state) => {
    const { transactions, searchFilter } = state;

    return transactions.filter((transaction) => {
      if (searchFilter.keyword) {
        const keyword = searchFilter.keyword.toLowerCase();
        if (!transaction.note.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      if (
        searchFilter.categoryId &&
        transaction.categoryId !== searchFilter.categoryId
      ) {
        return false;
      }

      if (searchFilter.startDate && transaction.date < searchFilter.startDate) {
        return false;
      }
      if (searchFilter.endDate && transaction.date > searchFilter.endDate) {
        return false;
      }

      if (searchFilter.type) {
        const category = state.categories.find(
          (c) => c.id === transaction.categoryId
        );
        if (category && category.type !== searchFilter.type) {
          return false;
        }
      }

      return true;
    });
  });
};

// 获取指定日期的交易记录
export const useTransactionsByDate = (date: string) => {
  return useSupabaseStore((state) =>
    state.transactions.filter((transaction) => transaction.date === date)
  );
};

// 获取分类映射
export const useCategoryMap = () => {
  return useSupabaseStore((state) => {
    const map = new Map<string, Category>();
    state.categories.forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  });
};
