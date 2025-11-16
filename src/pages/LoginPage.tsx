import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "@/lib/auth";
import { MemphisCard, MemphisInput, MemphisButton } from "@/components/ui";
import { DollarSign, Mail, Lock, AlertCircle } from "lucide-react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate("/app");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "登录失败，请检查邮箱和密码"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-memphis-background-primary px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="h-12 w-12 text-memphis-accent-cyan" />
            <h1 className="text-4xl font-bold text-memphis-text-primary">
              记账本
            </h1>
          </div>
          <p className="text-memphis-text-secondary">登录您的账户</p>
        </div>

        <MemphisCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-memphis-text-secondary mb-2"
              >
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-memphis-text-muted" />
                <MemphisInput
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-memphis-text-secondary mb-2"
              >
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-memphis-text-muted" />
                <MemphisInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <MemphisButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "登录中..." : "登录"}
            </MemphisButton>

            <div className="text-center">
              <p className="text-sm text-memphis-text-secondary">
                还没有账户？{" "}
                <Link
                  to="/register"
                  className="text-memphis-accent-cyan hover:underline font-medium"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </form>
        </MemphisCard>
      </div>
    </div>
  );
};

export default LoginPage;
