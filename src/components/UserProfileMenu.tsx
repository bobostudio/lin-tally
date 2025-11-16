import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Calendar, Settings } from "lucide-react";
import { signOut } from "@/lib/auth";

interface UserProfileMenuProps {
  session: any;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = session?.user;
  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "用户";
  const userEmail = user?.email || "";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("zh-CN")
    : "";

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 用户头像按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-memphis-primary-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-memphis-accent-cyan flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm text-memphis-text-primary font-medium hidden md:block">
          {userName}
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-memphis-background-card rounded-xl border border-memphis-primary-700 shadow-lg z-50">
          {/* 用户信息头部 */}
          <div className="p-4 border-b border-memphis-primary-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-memphis-accent-cyan flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-memphis-text-primary truncate">
                  {userName}
                </p>
                <p className="text-xs text-memphis-text-muted truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* 用户详细信息 */}
          <div className="p-3 space-y-2">
            {/* <div className="flex items-center space-x-3 px-3 py-2 text-sm text-memphis-text-secondary">
              <Mail className="h-4 w-4 text-memphis-text-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-memphis-text-muted">邮箱</p>
                <p className="truncate">{userEmail}</p>
              </div>
            </div> */}

            {createdAt && (
              <div className="flex items-center space-x-3 px-3 py-2 text-sm text-memphis-text-secondary">
                <Calendar className="h-4 w-4 text-memphis-text-muted" />
                <div>
                  <p className="text-xs text-memphis-text-muted">注册时间</p>
                  <p>{createdAt}</p>
                </div>
              </div>
            )}

            {/* <div className="flex items-center space-x-3 px-3 py-2 text-sm text-memphis-text-secondary">
              <User className="h-4 w-4 text-memphis-text-muted" />
              <div>
                <p className="text-xs text-memphis-text-muted">用户 ID</p>
                <p className="text-xs font-mono truncate">
                  {user?.id?.substring(0, 20)}...
                </p>
              </div>
            </div> */}
          </div>

          {/* 操作按钮 */}
          <div className="p-2 border-t border-memphis-primary-700">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-memphis-text-secondary hover:bg-memphis-primary-800 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>设置</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-memphis-accent-magenta hover:bg-memphis-primary-800 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
