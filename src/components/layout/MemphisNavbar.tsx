import React from "react";
import { Link, useLocation } from "react-router-dom";
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

const navigation = [
  { name: "记账", href: "/", icon: PlusCircle },
  { name: "日历", href: "/calendar", icon: Calendar },
  { name: "统计", href: "/statistics", icon: BarChart3 },
  { name: "搜索", href: "/search", icon: Search },
  { name: "设置", href: "/settings", icon: Settings },
];

const MemphisNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-memphis-primary-900 border-b border-memphis-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
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
        </div>
      </div>
    </nav>
  );
};

export default MemphisNavbar;
