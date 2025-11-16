import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Calendar,
  BarChart3,
  Search,
  Settings,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SyncStatusIndicator from "../SyncStatusIndicator";
import UserProfileMenu from "../UserProfileMenu";
import { getSession, signOut } from "@/lib/auth";

const navigation = [
  { name: "记账", href: "/app", icon: PlusCircle },
  { name: "日历", href: "/calendar", icon: Calendar },
  { name: "统计", href: "/statistics", icon: BarChart3 },
  { name: "搜索", href: "/search", icon: Search },
  { name: "设置", href: "/settings", icon: Settings },
];

const MemphisNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setSession(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-memphis-primary-900 border-b border-memphis-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/app" className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-memphis-text-primary" />
              <span className="text-2xl font-bold text-memphis-text-primary">
                记账本
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-xl border border-transparent",
                      "text-memphis-text-secondary hover:text-memphis-text-primary hover:border-memphis-primary-600",
                      "transition-all duration-200 font-medium",
                      isActive &&
                        "text-memphis-text-primary border-memphis-accent-cyan"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* 同步状态指示器 */}
            <SyncStatusIndicator />

            {/* 用户信息或登录按钮 */}
            {session ? (
              <div className="pl-4 border-l border-memphis-primary-700">
                <UserProfileMenu session={session} />
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-4 border-l border-memphis-primary-700">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-memphis-text-secondary hover:text-memphis-text-primary transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-medium bg-memphis-accent-cyan text-white rounded-lg hover:bg-opacity-80 transition-all"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-memphis-primary-800 border-t border-memphis-primary-700">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-xl border border-transparent",
                  "text-memphis-text-secondary hover:text-memphis-text-primary hover:border-memphis-primary-600",
                  "transition-all duration-200 font-medium",
                  isActive &&
                    "text-memphis-text-primary border-memphis-accent-cyan"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* 移动端登录/注册按钮 */}
          <div className="flex space-x-2 px-3 pt-3 border-t border-memphis-primary-700 mt-2">
            <Link
              to="/login"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-memphis-text-secondary hover:text-memphis-text-primary border border-memphis-primary-600 rounded-lg transition-colors"
            >
              登录
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center px-3 py-2 text-sm font-medium bg-memphis-accent-cyan text-white rounded-lg hover:bg-opacity-80 transition-all"
            >
              注册
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MemphisNavbar;
