import React from "react";
import { AlertCircle, Database, ExternalLink } from "lucide-react";
import { MemphisCard } from "@/components/ui";
import { isAuthConfigured } from "@/lib/auth";

const AuthConfigCheck: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConfigured] = React.useState(isAuthConfigured());

  if (isConfigured) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-memphis-background-primary flex items-center justify-center p-4">
      <MemphisCard className="max-w-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-memphis-text-primary mb-4">
            数据库未配置
          </h2>

          <p className="text-memphis-text-secondary mb-6">
            认证功能需要配置 Supabase 数据库连接。请按照以下步骤完成配置：
          </p>

          <div className="bg-memphis-primary-800 rounded-lg p-6 text-left space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-memphis-accent-cyan text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-memphis-text-primary font-medium mb-1">
                  获取 Supabase 数据库连接字符串
                </p>
                <p className="text-sm text-memphis-text-secondary">
                  登录 Supabase Dashboard → Project Settings → Database →
                  Connection string → URI
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-memphis-accent-cyan text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-memphis-text-primary font-medium mb-1">
                  配置环境变量
                </p>
                <p className="text-sm text-memphis-text-secondary mb-2">
                  在项目根目录创建{" "}
                  <code className="bg-memphis-primary-700 px-2 py-1 rounded">
                    .env
                  </code>{" "}
                  文件：
                </p>
                <pre className="bg-memphis-primary-900 p-3 rounded text-xs text-memphis-text-secondary overflow-x-auto">
                  {`VITE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
VITE_SUPABASE_URL=https://[PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key`}
                </pre>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-memphis-accent-cyan text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-memphis-text-primary font-medium mb-1">
                  运行数据库迁移
                </p>
                <p className="text-sm text-memphis-text-secondary">
                  在 Supabase SQL Editor 中执行{" "}
                  <code className="bg-memphis-primary-700 px-2 py-1 rounded">
                    supabase/migrations/20241116000000_auth_tables.sql
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-memphis-accent-cyan text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <p className="text-memphis-text-primary font-medium mb-1">
                  重启应用
                </p>
                <p className="text-sm text-memphis-text-secondary">
                  配置完成后重启开发服务器
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-memphis-accent-cyan text-white rounded-lg hover:bg-opacity-80 transition-all"
            >
              <Database className="h-4 w-4" />
              <span>打开 Supabase</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href="/README.auth-supabase.md"
              target="_blank"
              className="inline-flex items-center space-x-2 px-4 py-2 border border-memphis-primary-600 text-memphis-text-primary rounded-lg hover:bg-memphis-primary-800 transition-all"
            >
              <span>查看详细文档</span>
            </a>
          </div>
        </div>
      </MemphisCard>
    </div>
  );
};

export default AuthConfigCheck;
