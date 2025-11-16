import { supabase } from "./supabase";

// Supabase Auth 辅助函数

// 注册用户
export const signUp = async (
  email: string,
  password: string,
  name?: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
      },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;

  // 检查是否需要邮箱验证
  if (data.user && !data.session) {
    throw new Error(
      "请检查您的邮箱以验证账户。如果没有收到邮件，请检查垃圾邮件文件夹。"
    );
  }

  return data;
};

// 登录
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// 登出
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 获取当前用户
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// 获取当前会话
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (session: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
};

// 检查是否已配置
export const isAuthConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!supabaseUrl && !!supabaseKey;
};

// 导出类型
export type User = Awaited<ReturnType<typeof getCurrentUser>>;
export type Session = Awaited<ReturnType<typeof getSession>>;
