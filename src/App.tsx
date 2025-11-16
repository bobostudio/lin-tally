import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "@/pages/WelcomePage";
import HomePage from "@/pages/HomePage";
import CalendarPage from "@/pages/CalendarPage";
import StatisticsPage from "@/pages/StatisticsPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { initializeSupabaseStore, useLoading, useError } from "@/stores";

const App: React.FC = () => {
  const isLoading = useLoading();
  const error = useError();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // 初始化加载数据
    initializeSupabaseStore()
      .then(() => setIsInitialized(true))
      .catch(console.error);
  }, []);

  // 只在初始化时显示全局加载
  if (!isInitialized && isLoading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-memphis-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-memphis-accent-cyan mx-auto mb-4"></div>
          <p className="text-memphis-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  // 初始化失败时显示错误
  if (!isInitialized && error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-memphis-background-primary">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-memphis-background-surface rounded-lg p-6 border border-memphis-primary-700">
            <p className="text-red-500 mb-4">加载失败: {error}</p>
            <p className="text-memphis-text-secondary text-sm mb-4">
              请检查 Supabase 配置是否正确，或查看控制台了解详细错误信息
            </p>
            <button
              onClick={() => {
                setIsInitialized(false);
                initializeSupabaseStore()
                  .then(() => setIsInitialized(true))
                  .catch(console.error);
              }}
              className="px-4 py-2 bg-memphis-accent-cyan text-white rounded-lg hover:bg-opacity-80 transition-all"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 欢迎页 */}
        <Route path="/" element={<WelcomePage />} />

        {/* 认证路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 应用页面（需要登录后访问，暂时可直接访问用于测试） */}
        <Route path="/app" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
