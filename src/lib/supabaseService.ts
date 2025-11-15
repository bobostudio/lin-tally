import { supabase, DbTransaction, DbCategory } from "./supabase";
import { Transaction, Category } from "@/types";

// 转换函数：数据库格式 -> 应用格式
const dbTransactionToTransaction = (dbTx: DbTransaction): Transaction => ({
  id: dbTx.id,
  amount: dbTx.amount,
  categoryId: dbTx.category_id,
  date: dbTx.date,
  note: dbTx.note,
  createdAt: dbTx.created_at,
  updatedAt: dbTx.updated_at,
});

const dbCategoryToCategory = (dbCat: DbCategory): Category => ({
  id: dbCat.id,
  name: dbCat.name,
  icon: dbCat.icon,
  color: dbCat.color,
  type: dbCat.type,
  isDefault: dbCat.is_default,
  createdAt: dbCat.created_at,
});

// 转换函数：应用格式 -> 数据库格式
const transactionToDbTransaction = (
  tx: Partial<Transaction>
): Partial<DbTransaction> => ({
  ...(tx.id && { id: tx.id }),
  ...(tx.amount !== undefined && { amount: tx.amount }),
  ...(tx.categoryId && { category_id: tx.categoryId }),
  ...(tx.date && { date: tx.date }),
  ...(tx.note !== undefined && { note: tx.note }),
  ...(tx.createdAt && { created_at: tx.createdAt }),
  ...(tx.updatedAt && { updated_at: tx.updatedAt }),
});

const categoryToDbCategory = (cat: Partial<Category>): Partial<DbCategory> => ({
  ...(cat.id && { id: cat.id }),
  ...(cat.name && { name: cat.name }),
  ...(cat.icon && { icon: cat.icon }),
  ...(cat.color && { color: cat.color }),
  ...(cat.type && { type: cat.type }),
  ...(cat.isDefault !== undefined && { is_default: cat.isDefault }),
  ...(cat.createdAt && { created_at: cat.createdAt }),
});

// 交易记录服务
export const transactionService = {
  // 获取所有交易记录
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("tally_transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return (data || []).map(dbTransactionToTransaction);
  },

  // 创建交易记录
  async create(
    transaction: Omit<Transaction, "createdAt" | "updatedAt">
  ): Promise<Transaction> {
    const dbTx = transactionToDbTransaction({
      ...transaction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("tally_transactions")
      .insert(dbTx)
      .select()
      .single();

    if (error) throw error;
    return dbTransactionToTransaction(data);
  },

  // 更新交易记录
  async update(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>
  ): Promise<Transaction> {
    const dbUpdates = transactionToDbTransaction({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("tally_transactions")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return dbTransactionToTransaction(data);
  },

  // 删除交易记录
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tally_transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // 批量删除交易记录
  async deleteAll(): Promise<void> {
    const { error } = await supabase
      .from("tally_transactions")
      .delete()
      .neq("id", ""); // 删除所有记录

    if (error) throw error;
  },
};

// 分类服务
export const categoryService = {
  // 获取所有分类
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("tally_categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(dbCategoryToCategory);
  },

  // 创建分类
  async create(
    category: Omit<Category, "createdAt" | "isDefault">
  ): Promise<Category> {
    const dbCat = categoryToDbCategory({
      ...category,
      isDefault: false,
      createdAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("tally_categories")
      .insert(dbCat)
      .select()
      .single();

    if (error) throw error;
    return dbCategoryToCategory(data);
  },

  // 更新分类
  async update(
    id: string,
    updates: Partial<Omit<Category, "id" | "createdAt" | "isDefault">>
  ): Promise<Category> {
    const dbUpdates = categoryToDbCategory(updates);

    const { data, error } = await supabase
      .from("tally_categories")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return dbCategoryToCategory(data);
  },

  // 删除分类（只能删除非默认分类）
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tally_categories")
      .delete()
      .eq("id", id)
      .eq("is_default", false);

    if (error) throw error;
  },
};
