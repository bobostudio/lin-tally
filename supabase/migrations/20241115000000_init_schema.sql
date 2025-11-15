-- 创建分类表
CREATE TABLE IF NOT EXISTS tally_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建交易记录表
CREATE TABLE IF NOT EXISTS tally_transactions (
  id TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  category_id TEXT NOT NULL REFERENCES tally_categories(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tally_transactions_date ON tally_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_tally_transactions_category_id ON tally_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_tally_transactions_created_at ON tally_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tally_categories_type ON tally_categories(type);

-- 插入默认分类数据
INSERT INTO tally_categories (id, name, icon, color, type, is_default, created_at) VALUES
  -- 支出分类
  ('food', '餐饮', 'Utensils', '#FF6B9D', 'expense', true, NOW()),
  ('shopping', '购物', 'ShoppingBag', '#FFD93D', 'expense', true, NOW()),
  ('transport', '交通', 'Car', '#4ECDC4', 'expense', true, NOW()),
  ('entertainment', '娱乐', 'Gamepad2', '#A8E6CF', 'expense', true, NOW()),
  ('housing', '住房', 'Home', '#FFA726', 'expense', true, NOW()),
  ('medical', '医疗', 'Heart', '#66BB6A', 'expense', true, NOW()),
  ('education', '教育', 'Book', '#ff3d8a', 'expense', true, NOW()),
  ('other-expense', '其他支出', 'MoreHorizontal', '#a3a3a3', 'expense', true, NOW()),
  -- 收入分类
  ('salary', '工资', 'DollarSign', '#66BB6A', 'income', true, NOW()),
  ('bonus', '奖金', 'Gift', '#FFD93D', 'income', true, NOW()),
  ('investment', '投资', 'TrendingUp', '#4ECDC4', 'income', true, NOW()),
  ('other-income', '其他收入', 'Plus', '#A8E6CF', 'income', true, NOW())
ON CONFLICT (id) DO NOTHING;
