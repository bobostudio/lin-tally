// 本地 localStorage store（已弃用，保留作为备份）
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Transaction,
  Category,
  AppState,
  SearchFilter,
  DateRange,
} from "@/types";
import { getCurrentDate, generateId } from "@/lib/utils";

// 默认分类配置
const DEFAULT_CATEGORIES = [
  // 支出分类
  {
    id: "food",
    name: "餐饮",
    icon: "Utensils",
    color: "#FF6B9D",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "shopping",
    name: "购物",
    icon: "ShoppingBag",
    color: "#FFD93D",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "transport",
    name: "交通",
    icon: "Car",
    color: "#4ECDC4",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "entertainment",
    name: "娱乐",
    icon: "Gamepad2",
    color: "#A8E6CF",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "housing",
    name: "住房",
    icon: "Home",
    color: "#FFA726",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "medical",
    name: "医疗",
    icon: "Heart",
    color: "#66BB6A",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "education",
    name: "教育",
    icon: "Book",
    color: "#ff3d8a",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "other-expense",
    name: "其他支出",
    icon: "MoreHorizontal",
    color: "#a3a3a3",
    type: "expense" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },

  // 收入分类
  {
    id: "salary",
    name: "工资",
    icon: "DollarSign",
    color: "#66BB6A",
    type: "income" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "bonus",
    name: "奖金",
    icon: "Gift",
    color: "#FFD93D",
    type: "income" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "investment",
    name: "投资",
    icon: "TrendingUp",
    color: "#4ECDC4",
    type: "income" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "other-income",
    name: "其他收入",
    icon: "Plus",
    color: "#A8E6CF",
    type: "income" as const,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

// 初始状态
const initialState = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  currentDate: getCurrentDate(),
  dateRange: "month" as DateRange,
  searchFilter: {},
  isLoading: false,
  error: null,
};

// 创建状态存储
export const useLocalStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 交易记录相关操作
      addTransaction: (
        transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
      ) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (
        id: string,
        updates: Partial<Omit<Transaction, "id" | "createdAt">>
      ) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : transaction
          ),
        }));
      },

      deleteTransaction: (id: string) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        }));
      },

      // 分类相关操作
      addCategory: (
        category: Omit<Category, "id" | "createdAt" | "isDefault">
      ) => {
        const newCategory: Category = {
          ...category,
          id: generateId(),
          isDefault: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (
        id: string,
        updates: Partial<Omit<Category, "id" | "createdAt" | "isDefault">>
      ) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id: string) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
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

      // 数据管理操作
      clearAllData: () => {
        set({
          transactions: [],
          categories: DEFAULT_CATEGORIES,
          currentDate: getCurrentDate(),
          dateRange: "month",
          searchFilter: {},
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "accounting-app-storage", // localStorage键名
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        currentDate: state.currentDate,
        dateRange: state.dateRange,
      }), // 只持久化这些字段
    }
  )
);
