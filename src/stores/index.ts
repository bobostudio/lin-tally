// 导出 Supabase store 作为默认 store
export * from "./supabaseStore";

// 为了兼容性，导出 useSupabaseStore 作为 useStore
export { useSupabaseStore as useStore } from "./supabaseStore";
