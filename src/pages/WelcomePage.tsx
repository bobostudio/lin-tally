import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  Shield,
  Cloud,
} from "lucide-react";
import { MemphisCard, MemphisButton } from "@/components/ui";

const WelcomePage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-memphis-background-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <DollarSign className="h-16 w-16 text-memphis-accent-cyan" />
              <h1 className="text-5xl font-bold text-memphis-text-primary">
                记账本
              </h1>
            </div>
            <p className="text-xl text-memphis-text-secondary mb-8 max-w-2xl mx-auto">
              简单、优雅、高效的个人记账应用
            </p>
            <p className="text-memphis-text-muted mb-12">
              云端同步 · 数据安全 · 随时随地记账
            </p>

            <div className="flex items-center justify-center space-x-4">
              <Link to="/register">
                <MemphisButton variant="primary" className="px-8 py-3 text-lg">
                  立即注册
                </MemphisButton>
              </Link>
              <Link to="/login">
                <MemphisButton
                  variant="secondary"
                  className="px-8 py-3 text-lg"
                >
                  登录账户
                </MemphisButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-memphis-text-primary mb-12">
          为什么选择我们
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-memphis-accent-cyan/20 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-memphis-accent-cyan" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              智能统计
            </h3>
            <p className="text-memphis-text-secondary">
              自动生成收支报表，清晰了解财务状况
            </p>
          </MemphisCard>

          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-memphis-accent-green/20 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-memphis-accent-green" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              日历视图
            </h3>
            <p className="text-memphis-text-secondary">
              直观的日历界面，快速查看每日收支
            </p>
          </MemphisCard>

          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-memphis-accent-magenta/20 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-memphis-accent-magenta" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              数据分析
            </h3>
            <p className="text-memphis-text-secondary">
              多维度图表分析，洞察消费习惯
            </p>
          </MemphisCard>

          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Cloud className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              云端同步
            </h3>
            <p className="text-memphis-text-secondary">
              数据实时同步到云端，永不丢失
            </p>
          </MemphisCard>

          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              安全可靠
            </h3>
            <p className="text-memphis-text-secondary">
              数据加密存储，保护您的隐私安全
            </p>
          </MemphisCard>

          <MemphisCard className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-memphis-text-primary mb-3">
              完全免费
            </h3>
            <p className="text-memphis-text-secondary">
              所有功能完全免费，无任何隐藏费用
            </p>
          </MemphisCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-memphis-primary-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-memphis-text-primary mb-4">
            开始您的记账之旅
          </h2>
          <p className="text-memphis-text-secondary mb-8">
            注册账户，立即体验智能记账的便捷
          </p>
          <Link to="/register">
            <MemphisButton variant="primary" className="px-10 py-4 text-lg">
              免费注册
            </MemphisButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
