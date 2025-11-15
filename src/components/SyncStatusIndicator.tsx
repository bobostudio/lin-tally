import React from "react";
import { useSyncStatus } from "@/stores";
import { Cloud, CloudOff, Loader2, CheckCircle2 } from "lucide-react";

const SyncStatusIndicator: React.FC = () => {
  const syncStatus = useSyncStatus();

  const statusConfig = {
    idle: {
      icon: Cloud,
      color: "text-memphis-text-muted",
      bgColor: "bg-memphis-primary-700",
      text: "已连接",
      show: false, // idle 状态不显示
    },
    syncing: {
      icon: Loader2,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      text: "同步中...",
      show: true,
      animate: true,
    },
    synced: {
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      text: "已同步",
      show: true,
    },
    error: {
      icon: CloudOff,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      text: "同步失败",
      show: true,
    },
  };

  const config = statusConfig[syncStatus];
  const Icon = config.icon;

  if (!config.show) {
    return null;
  }

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${config.bgColor} border border-memphis-primary-600 transition-all duration-300`}
    >
      <Icon
        className={`h-4 w-4 ${config.color} ${
          config.animate ? "animate-spin" : ""
        }`}
      />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default SyncStatusIndicator;
