# Supabase 集成指南

## 配置步骤

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 创建新项目
3. 等待项目初始化完成

### 2. 运行数据库迁移

在 Supabase Dashboard 中：

1. 进入 SQL Editor
2. 复制 `supabase/migrations/20241115000000_init_schema.sql` 的内容
3. 粘贴并执行 SQL

或者使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

### 3. 配置环境变量

1. 在 Supabase Dashboard 的 Settings > API 中找到：

   - Project URL
   - anon public key

2. 创建 `.env` 文件（参考 `.env.example`）：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 切换到 Supabase Store

有两种方式使用 Supabase：

#### 方式 1：替换现有 store（推荐）

修改 `src/stores/index.ts`，导出 Supabase store：

```typescript
// 从 supabaseStore 导出所有内容
export * from "./supabaseStore";
```

#### 方式 2：使用新的 App 组件

在 `src/main.tsx` 中：

```typescript
import App from "./App.supabase"; // 使用 Supabase 版本
```

### 5. 启动应用

```bash
pnpm dev
```

## 数据库结构

### tally_categories 表

| 字段       | 类型        | 说明                   |
| ---------- | ----------- | ---------------------- |
| id         | TEXT        | 主键                   |
| name       | TEXT        | 分类名称               |
| icon       | TEXT        | 图标名称               |
| color      | TEXT        | 颜色                   |
| type       | TEXT        | 类型（income/expense） |
| is_default | BOOLEAN     | 是否默认分类           |
| created_at | TIMESTAMPTZ | 创建时间               |

### tally_transactions 表

| 字段        | 类型        | 说明            |
| ----------- | ----------- | --------------- |
| id          | TEXT        | 主键            |
| amount      | NUMERIC     | 金额            |
| category_id | TEXT        | 分类 ID（外键） |
| date        | DATE        | 日期            |
| note        | TEXT        | 备注            |
| created_at  | TIMESTAMPTZ | 创建时间        |
| updated_at  | TIMESTAMPTZ | 更新时间        |

## API 使用

### 交易记录操作

```typescript
import { useSupabaseStore } from "@/stores/supabaseStore";

const store = useSupabaseStore();

// 添加交易
await store.addTransaction({
  amount: -50,
  categoryId: "food",
  date: "2024-11-15",
  note: "午餐",
});

// 更新交易
await store.updateTransaction("transaction-id", {
  amount: -60,
  note: "午餐（更新）",
});

// 删除交易
await store.deleteTransaction("transaction-id");
```

### 分类操作

```typescript
// 添加分类
await store.addCategory({
  name: "旅游",
  icon: "Plane",
  color: "#FF6B9D",
  type: "expense",
});

// 更新分类
await store.updateCategory("category-id", {
  name: "旅行",
});

// 删除分类（仅非默认分类）
await store.deleteCategory("category-id");
```

## 数据迁移

如果你已有本地数据（localStorage），可以创建迁移脚本：

```typescript
import { useStore } from "@/stores"; // 旧的 store
import { useSupabaseStore } from "@/stores/supabaseStore";

async function migrateData() {
  const localData = useStore.getState();
  const supabaseStore = useSupabaseStore.getState();

  // 迁移交易记录
  for (const transaction of localData.transactions) {
    await supabaseStore.addTransaction(transaction);
  }

  console.log("数据迁移完成");
}
```

## 注意事项

1. **环境变量**：确保 `.env` 文件不要提交到 Git
2. **Row Level Security (RLS)**：当前配置未启用 RLS，适合个人使用。如需多用户支持，需配置 RLS 策略
3. **错误处理**：所有操作都会抛出错误，建议使用 try-catch 处理
4. **性能优化**：已添加数据库索引，查询性能良好

## 多用户支持（可选）

如需支持多用户，需要：

1. 启用 Supabase Authentication
2. 在表中添加 `user_id` 字段
3. 配置 RLS 策略
4. 修改查询逻辑

详见 Supabase 文档：https://supabase.com/docs/guides/auth
