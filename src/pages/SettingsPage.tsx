import React, { useState } from "react";
import { useStore } from "../stores";
import {
  MemphisCard,
  MemphisButton,
  MemphisInput,
  MemphisModal,
} from "@/components/ui";
import { MemphisNavbar } from "@/components";
import {
  Trash2,
  Plus,
  Download,
  Upload,
  Palette,
  DollarSign,
  Bell,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

const SettingsPage: React.FC = () => {
  const {
    categories,
    addCategory,
    addTransaction,
    transactions,
    clearAllData,
  } = useStore();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    transactions: unknown[];
    categories: unknown[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create transactions sheet
    const transactionsData = transactions.map((t) => ({
      日期: t.date,
      分类: categories.find((c) => c.id === t.categoryId)?.name || "未知分类",
      金额: t.amount,
      类型: t.amount > 0 ? "收入" : "支出",
      备注: t.note || "",
      创建时间: t.createdAt,
    }));
    const transactionsWS = XLSX.utils.json_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, transactionsWS, "记账记录");

    // Create categories sheet
    const categoriesData = categories.map((c) => ({
      分类名称: c.name,
      图标: c.icon,
      类型: c.type === "income" ? "收入" : "支出",
      颜色: c.color,
    }));
    const categoriesWS = XLSX.utils.json_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, categoriesWS, "分类设置");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `记账数据-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
    setImportPreview(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Read transactions sheet
        const transactionsSheet = workbook.Sheets["记账记录"];
        const transactionsData = XLSX.utils.sheet_to_json(transactionsSheet);

        // Read categories sheet
        const categoriesSheet = workbook.Sheets["分类设置"];
        const categoriesData = XLSX.utils.sheet_to_json(categoriesSheet);

        setImportPreview({
          transactions: transactionsData,
          categories: categoriesData,
        });
      } catch (error) {
        alert("文件格式错误，请选择有效的Excel文件" + error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);

    try {
      // 数据验证
      if (
        !Array.isArray(importPreview.categories) ||
        !Array.isArray(importPreview.transactions)
      ) {
        throw new Error("导入文件格式错误");
      }

      // 1. 处理分类导入
      let importedCategoriesCount = 0;
      let importedTransactionsCount = 0;
      const errors: string[] = [];

      // 处理导入的分类
      for (const cat of importPreview.categories) {
        try {
          const categoryName = cat["分类名称"]?.toString().trim();
          const categoryType: "income" | "expense" =
            cat["类型"] === "收入" ? "income" : "expense";
          const categoryIcon = cat["图标"]?.toString().trim() || "Tag";
          const categoryColor = cat["颜色"]?.toString().trim() || "#666666";

          if (!categoryName) {
            errors.push("发现空分类名称，已跳过");
            continue;
          }

          // 检查是否已存在同名分类
          const existingCategory = categories.find(
            (c) => c.name === categoryName
          );
          if (!existingCategory) {
            // 验证颜色格式
            const colorRegex = /^#[0-9A-Fa-f]{6}$/;
            const validColor = colorRegex.test(categoryColor)
              ? categoryColor
              : "#666666";

            // 创建新分类
            const newCategoryData = {
              name: categoryName,
              type: categoryType,
              icon: categoryIcon,
              color: validColor,
            };

            addCategory(newCategoryData);
            importedCategoriesCount++;
            // 等待一小段时间确保分类创建完成
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          errors.push(`分类 "${cat["分类名称"]}" 导入失败: ${error}`);
        }
      }

      // 2. 处理交易导入 - 重新获取分类列表以确保ID映射正确
      const currentCategories = categories;

      for (const trans of importPreview.transactions) {
        try {
          const transactionDate = trans["日期"]?.toString().trim();
          const categoryName = trans["分类"]?.toString().trim();
          const transactionAmount = parseFloat(trans["金额"]?.toString());
          const transactionNote = trans["备注"]?.toString().trim() || "";

          if (!transactionDate || !categoryName || isNaN(transactionAmount)) {
            errors.push("交易数据验证失败：日期、分类或金额缺失");
            continue;
          }

          // 查找分类
          const category = currentCategories.find(
            (c) => c.name === categoryName
          );
          if (!category) {
            errors.push(`未找到分类 "${categoryName}"，该交易已跳过`);
            continue;
          }

          // 验证日期格式
          let formattedDate = transactionDate;
          if (transactionDate.includes("/")) {
            const [month, day, year] = transactionDate.split("/");
            if (month && day && year && month.length <= 2 && day.length <= 2) {
              formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
            } else {
              errors.push(`无效日期格式: ${transactionDate}`);
              continue;
            }
          }

          // 验证金额
          if (transactionAmount === 0) {
            errors.push("金额不能为零，已跳过");
            continue;
          }

          // 根据分类类型调整金额符号
          const finalAmount =
            category.type === "income"
              ? Math.abs(transactionAmount)
              : -Math.abs(transactionAmount);

          const transactionData = {
            amount: finalAmount,
            categoryId: category.id,
            date: formattedDate,
            note: transactionNote,
          };

          addTransaction(transactionData);
          importedTransactionsCount++;
          // 等待一小段时间确保交易创建完成
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          errors.push(`交易导入失败: ${error}`);
        }
      }

      let successMessage = `成功导入 ${importedTransactionsCount} 条记账记录和 ${importedCategoriesCount} 个新分类`;
      if (errors.length > 0) {
        successMessage += `\n\n注意：${errors.length} 个项目导入失败（已在控制台记录）`;
        console.warn("导入错误详情:", errors);
      }

      alert(successMessage);
      setIsImporting(false);
      setIsImportModalOpen(false);
      setImportPreview(null);
    } catch (error) {
      console.error("导入失败:", error);
      alert(`导入失败: ${error instanceof Error ? error.message : "未知错误"}`);
      setIsImporting(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !newCategoryIcon.trim()) {
      alert("请填写分类名称和图标");
      return;
    }

    addCategory({
      name: newCategoryName.trim(),
      icon: newCategoryIcon.trim(),
      type: "expense",
      color: "#FF6B9D",
    });

    setNewCategoryName("");
    setNewCategoryIcon("");
  };

  const handleDeleteCategory = (categoryId: string) => {
    const isUsed = transactions.some((t) => t.categoryId === categoryId);
    if (isUsed) {
      alert("该分类已被使用，无法删除");
      return;
    }

    if (confirm("确定要删除这个分类吗？")) {
      // Remove category logic would go here
      alert("删除功能开发中...");
    }
  };

  const handleClearAllData = () => {
    if (confirm("警告：此操作将删除所有数据，且无法恢复。确定要继续吗？")) {
      clearAllData();
      alert("所有数据已清除");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <MemphisNavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-memphis-text-primary mb-8">
            设置
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 数据管理 */}
            <MemphisCard>
              <h2 className="text-xl font-semibold text-memphis-text-primary mb-4 flex items-center">
                <Download className="mr-2" size={20} />
                数据管理
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <MemphisButton
                    variant="primary"
                    onClick={handleExportData}
                    className="flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    导出数据
                  </MemphisButton>

                  <MemphisButton
                    variant="secondary"
                    onClick={handleImportClick}
                    className="flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    导入数据
                  </MemphisButton>

                  <MemphisButton
                    variant="danger"
                    onClick={handleClearAllData}
                    className="flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    清除所有数据
                  </MemphisButton>
                </div>
                <p className="text-sm text-gray-600">
                  导出功能将保存所有记账记录和分类设置到Excel文件
                </p>
              </div>
            </MemphisCard>

            {/* 分类管理 */}
            <MemphisCard>
              <h2 className="text-xl font-semibold text-memphis-text-primary mb-4 flex items-center">
                <Palette className="mr-2" size={20} />
                分类管理
              </h2>

              {/* 添加新分类 */}
              <div className="mb-6 p-4 bg-memphis-primary-800 bg-opacity-50 rounded-lg border border-memphis-primary-700">
                <h3 className="font-medium text-memphis-text-primary mb-3">
                  添加新分类
                </h3>
                <div className="flex flex-wrap gap-3">
                  <MemphisInput
                    placeholder="分类名称"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 min-w-[120px]"
                  />
                  <MemphisInput
                    placeholder="图标名称 (如: coffee, shopping-bag)"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                    className="flex-1 min-w-[150px]"
                  />
                  <MemphisButton
                    variant="success"
                    onClick={handleAddCategory}
                    className="flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    添加
                  </MemphisButton>
                </div>
              </div>

              {/* 现有分类列表 */}
              <div className="space-y-3">
                <h3 className="font-medium text-memphis-text-primary">
                  现有分类
                </h3>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-memphis-background-surface rounded-lg border border-memphis-primary-700 shadow-memphis-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-memphis-primary-700 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-memphis-text-primary">
                        {category.name}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          category.type === "income"
                            ? "bg-memphis-accent-green bg-opacity-20 text-memphis-accent-green"
                            : "bg-memphis-accent-magenta bg-opacity-20 text-memphis-accent-magenta"
                        }`}
                      >
                        {category.type === "income" ? "收入" : "支出"}
                      </span>
                    </div>
                    {![
                      "food",
                      "shopping",
                      "transport",
                      "entertainment",
                      "housing",
                      "medical",
                      "education",
                      "other-expense",
                      "salary",
                      "bonus",
                      "investment",
                      "other-income",
                    ].includes(category.id) && (
                      <MemphisButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center"
                      >
                        <Trash2 size={14} />
                      </MemphisButton>
                    )}
                  </div>
                ))}
              </div>
            </MemphisCard>

            {/* 货币设置 */}
            <MemphisCard>
              <h2 className="text-xl font-semibold text-memphis-text-primary mb-4 flex items-center">
                <DollarSign className="mr-2" size={20} />
                货币设置
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-memphis-text-secondary mb-2">
                    货币符号
                  </label>
                  <select
                    defaultValue="¥"
                    className="w-full p-3 border-2 border-memphis-primary-700 rounded-lg focus:ring-2 focus:ring-memphis-accent-cyan focus:border-memphis-accent-cyan bg-memphis-background-surface text-memphis-text-primary"
                  >
                    <option value="¥">¥ 人民币</option>
                    <option value="$">$ 美元</option>
                    <option value="€">€ 欧元</option>
                    <option value="£">£ 英镑</option>
                    <option value="₹">₹ 印度卢比</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-memphis-text-secondary mb-2">
                    小数位数
                  </label>
                  <select
                    defaultValue="2"
                    className="w-full p-3 border-2 border-memphis-primary-700 rounded-lg focus:ring-2 focus:ring-memphis-accent-cyan focus:border-memphis-accent-cyan bg-memphis-background-surface text-memphis-text-primary"
                  >
                    <option value="0">0 位</option>
                    <option value="1">1 位</option>
                    <option value="2">2 位</option>
                  </select>
                </div>
              </div>
            </MemphisCard>

            {/* 通知设置 */}
            <MemphisCard>
              <h2 className="text-xl font-semibold text-memphis-text-primary mb-4 flex items-center">
                <Bell className="mr-2" size={20} />
                通知设置
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-memphis-text-secondary">
                    每日记账提醒
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-memphis-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-memphis-accent-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-memphis-primary-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-memphis-accent-cyan"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-memphis-text-secondary">
                    预算超支提醒
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-memphis-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-memphis-accent-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-memphis-primary-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-memphis-accent-cyan"></div>
                  </label>
                </div>
              </div>
            </MemphisCard>

            {/* 关于 */}
            <MemphisCard>
              <h2 className="text-xl font-semibold text-memphis-text-primary mb-4">
                关于应用
              </h2>
              <div className="space-y-2 text-memphis-text-secondary">
                <p>
                  <strong>版本:</strong> 1.0.0
                </p>
                <p>
                  <strong>开发者:</strong> Memphis Accounting Team
                </p>
                <p>
                  <strong>描述:</strong> 一个采用孟菲斯风格设计的个人记账应用
                </p>
                <p>
                  <strong>技术栈:</strong> React + TypeScript + Vite +
                  TailwindCSS
                </p>
              </div>
            </MemphisCard>
          </div>
        </div>
      </div>

      {/* 导入数据模态框 */}
      <MemphisModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="导入Excel数据"
        size="lg"
      >
        <div className="space-y-6">
          {!importPreview ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-16 w-16 text-memphis-accent-cyan mx-auto mb-4" />
              <h3 className="text-lg font-medium text-memphis-text-primary mb-2">
                选择Excel文件
              </h3>
              <p className="text-memphis-text-secondary mb-6">
                请选择要导入的Excel文件，文件应包含记账记录和分类设置
              </p>

              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-memphis-primary-600 rounded-xl p-8 hover:border-memphis-accent-cyan hover:bg-memphis-primary-800 transition-all duration-200">
                  <Upload className="h-8 w-8 text-memphis-accent-cyan mx-auto mb-2" />
                  <p className="text-memphis-text-primary font-medium">
                    点击选择文件
                  </p>
                  <p className="text-memphis-text-secondary text-sm">
                    或拖拽文件到此处
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <div className="mt-4 p-3 bg-memphis-primary-800 bg-opacity-50 rounded-lg border border-memphis-primary-700">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-memphis-accent-cyan mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-memphis-text-secondary">
                    <p className="font-medium mb-1">文件格式要求：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Excel文件（.xlsx, .xls）</li>
                      <li>包含"记账记录"和"分类设置"工作表</li>
                      <li>数据格式与导出的Excel文件一致</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-memphis-text-primary mb-4">
                  导入预览
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-memphis-primary-800 bg-opacity-50 rounded-lg p-4 border border-memphis-primary-700">
                    <div className="flex items-center mb-2">
                      <FileSpreadsheet className="h-5 w-5 text-memphis-accent-green mr-2" />
                      <span className="font-medium text-memphis-text-primary">
                        记账记录
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-memphis-accent-green">
                      {importPreview.transactions.length}
                    </p>
                    <p className="text-sm text-memphis-text-secondary">
                      条记录
                    </p>
                  </div>

                  <div className="bg-memphis-primary-800 bg-opacity-50 rounded-lg p-4 border border-memphis-primary-700">
                    <div className="flex items-center mb-2">
                      <Palette className="h-5 w-5 text-memphis-accent-cyan mr-2" />
                      <span className="font-medium text-memphis-text-primary">
                        分类设置
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-memphis-accent-cyan">
                      {importPreview.categories.length}
                    </p>
                    <p className="text-sm text-memphis-text-secondary">
                      个分类
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-memphis-primary-800 bg-opacity-30 rounded-lg border border-memphis-primary-700">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-memphis-accent-cyan mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-memphis-text-secondary">
                      <p className="font-medium mb-1">导入说明：</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>重复的分类将自动跳过</li>
                        <li>记账记录将按日期排序</li>
                        <li>导入操作不可撤销</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <MemphisButton
                  variant="secondary"
                  onClick={() => {
                    setImportPreview(null);
                  }}
                  className="flex-1"
                >
                  重新选择
                </MemphisButton>
                <MemphisButton
                  variant="primary"
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                  className="flex-1"
                >
                  {isImporting ? "导入中..." : "确认导入"}
                </MemphisButton>
              </div>
            </div>
          )}
        </div>
      </MemphisModal>
    </div>
  );
};

export default SettingsPage;
