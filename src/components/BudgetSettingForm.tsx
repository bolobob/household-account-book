import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { X, DollarSign } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BudgetSettingFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  year: number;
  month: number;
  onBudgetSave: (year: number, month: number, budget: number) => void;
}

export function BudgetSettingForm({ 
  isOpen, 
  onClose, 
  currentBudget, 
  year, 
  month, 
  onBudgetSave 
}: BudgetSettingFormProps) {
  const [budget, setBudget] = useState(currentBudget.toString());

  useEffect(() => {
    setBudget(currentBudget.toString());
  }, [currentBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      toast.error("正しい予算額を入力してください");
      return;
    }

    onBudgetSave(year, month, numBudget);
    toast.success("予算を更新しました");
    onClose();
  };

  if (!isOpen) return null;

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">予算設定</h3>
                <p className="text-sm text-gray-600">{year}年{monthNames[month - 1]}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="budget" className="text-gray-700">月の予算額</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="text-xl h-12 text-center rounded-lg border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50] mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                0円を入力すると予算制限なしになります
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-lg border-gray-200"
              >
                キャンセル
              </Button>
              <Button 
                type="submit"
                className="flex-1 h-12 rounded-lg bg-[#4CAF50] hover:bg-[#45a049] text-white"
              >
                保存
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}