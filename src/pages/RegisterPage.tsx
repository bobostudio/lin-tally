import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp, signIn } from "@/lib/auth";
import { MemphisCard, MemphisInput, MemphisButton } from "@/components/ui";
import {
  DollarSign,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 验证密码
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, name);

      // 如果注册成功且有会话，说明邮箱验证已
      await signIn(email, password);

      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { text: "弱", color: "text-red-500" };
    if (password.length < 10) return { text: "中", color: "text-yellow-500" };
    return { text: "强", color: "text-green-500" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-memphis-background-primary px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="h-12 w-12 text-memphis-accent-cyan" />
            <h1 className="text-4xl font-bold text-memphis-text-primary">
              记账本
            </h1>
          </div>
          <p className="text-memphis-text-secondary">创建您的账户</p>
        </div>

        <MemphisCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-memphis-text-secondary mb-2"
              >
                姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-memphis-text-muted" />
                <MemphisInput
                  id="name"
                  type="text"
                  placeholder="您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

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
                  placeholder="至少 6 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              {strength && (
                <p className={`text-xs mt-1 ${strength.color}`}>
                  密码强度: {strength.text}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-memphis-text-secondary mb-2"
              >
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-memphis-text-muted" />
                <MemphisInput
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            <MemphisButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "注册中..." : "注册"}
            </MemphisButton>

            <div className="text-center">
              <p className="text-sm text-memphis-text-secondary">
                已有账户？{" "}
                <Link
                  to="/login"
                  className="text-memphis-accent-cyan hover:underline font-medium"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </form>
        </MemphisCard>
      </div>
    </div>
  );
};

export default RegisterPage;
