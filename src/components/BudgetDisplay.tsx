import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Settings } from "lucide-react";

interface BudgetDisplayProps {
  budget: number;
  spent: number;
  year: number;
  month: number;
  onBudgetSettingClick: () => void;
}

export function BudgetDisplay({ budget, spent, year, month, onBudgetSettingClick }: BudgetDisplayProps) {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = budget > 0 && spent > budget;
  const remaining = budget - spent;

  // ペース計算（現在月の場合のみ）
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  
  let paceStatus = null;
  
  if (isCurrentMonth && budget > 0) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysPassed = today.getDate();
    const expectedPercentage = (daysPassed / daysInMonth) * 100;
    const paceComparison = percentage - expectedPercentage;

    if (Math.abs(paceComparison) < 5) {
      paceStatus = {
        icon: <Minus className="w-4 h-4" />,
        text: "順調なペース",
        color: "text-green-600 bg-green-50",
        description: "予算通りに使っています"
      };
    } else if (paceComparison > 0) {
      paceStatus = {
        icon: <TrendingUp className="w-4 h-4" />,
        text: "早いペース",
        color: "text-orange-600 bg-orange-50",
        description: `予定より${Math.abs(paceComparison).toFixed(1)}%多く使用中`
      };
    } else {
      paceStatus = {
        icon: <TrendingDown className="w-4 h-4" />,
        text: "余裕あり",
        color: "text-blue-600 bg-blue-50",
        description: `予定より${Math.abs(paceComparison).toFixed(1)}%節約中`
      };
    }
  }

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">
          {year}年{monthNames[month - 1]}の予算
        </h2>
        <div className="flex items-center gap-2">
          {isOverBudget && (
            <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">予算オーバー</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onBudgetSettingClick}
            className="flex items-center gap-2 h-8 px-3 rounded-lg border-gray-200 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">設定</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        {budget > 0 ? (
          <>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ¥{budget.toLocaleString()}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>使用額: ¥{spent.toLocaleString()}</span>
              <span className={isOverBudget ? "text-red-500" : "text-green-600"}>
                残り: ¥{remaining.toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              予算未設定
            </div>
            <div className="text-sm text-gray-600 mb-3">
              使用額: ¥{spent.toLocaleString()}
            </div>
          </>
        )}

        {/* ペース表示（現在月のみ） */}
        {paceStatus && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${paceStatus.color} mb-3`}>
            {paceStatus.icon}
            <div>
              <span className="font-medium text-sm">{paceStatus.text}</span>
              <div className="text-xs opacity-80">{paceStatus.description}</div>
            </div>
          </div>
        )}
      </div>

      {budget > 0 && (
        <>
          <Progress 
            value={Math.min(percentage, 100)} 
            className="w-full h-3"
            style={{
              '--progress-foreground': isOverBudget ? '#F44336' : '#4CAF50'
            } as React.CSSProperties}
          />
          
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{percentage.toFixed(1)}%</span>
            {isCurrentMonth && (
              <span>月の{Math.round((today.getDate() / new Date(year, month, 0).getDate()) * 100)}%経過</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}