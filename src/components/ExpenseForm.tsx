import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Wallet, Edit, X, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  amount: number;
  date: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: { amount: number; date: string }) => void;
  onUpdateExpense?: (expense: { amount: number; date: string }) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

export function ExpenseForm({ 
  onAddExpense, 
  onUpdateExpense, 
  editingExpense, 
  onCancelEdit 
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isEditMode = !!editingExpense;

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setDate(editingExpense.date);
    } else {
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      toast.error("金額を入力してください");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("正しい金額を入力してください");
      return;
    }

    const expenseData = {
      amount: numAmount,
      date
    };

    if (isEditMode && onUpdateExpense) {
      onUpdateExpense(expenseData);
      toast.success("支出を更新しました");
    } else {
      onAddExpense(expenseData);
      setAmount("");
      toast.success("支出を記録しました");
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <Card className={`p-6 mb-6 rounded-xl shadow-sm transition-all duration-200 ${
      isEditMode 
        ? 'bg-orange-50 border-2 border-[#FF9800] shadow-lg' 
        : 'bg-white border shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isEditMode ? 'bg-[#FF9800]' : 'bg-[#4CAF50]'
          }`}>
            {isEditMode ? <Edit className="w-5 h-5 text-white" /> : <Wallet className="w-5 h-5 text-white" />}
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-800">
              {isEditMode ? "支出を編集" : "支出を記録"}
            </h3>
            {isEditMode && (
              <Badge variant="secondary" className="bg-[#FF9800] text-white hover:bg-[#F57C00] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                編集中
              </Badge>
            )}
          </div>
        </div>
        {isEditMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 rounded-lg hover:bg-orange-100"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 編集中の支出情報を表示 */}
      {isEditMode && editingExpense && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#FF9800]" />
            <span className="text-sm font-medium text-gray-700">編集中の支出</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>元の金額: <span className="font-medium">¥{editingExpense.amount.toLocaleString()}</span></div>
            <div>元の日付: <span className="font-medium">{formatDate(editingExpense.date)}</span></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="amount" className="text-gray-700 mb-3 block">金額</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`text-2xl h-16 text-center rounded-lg border-gray-200 bg-gray-50 transition-all duration-200 ${
              isEditMode 
                ? 'focus:border-[#FF9800] focus:ring-[#FF9800] border-orange-200' 
                : 'focus:border-[#4CAF50] focus:ring-[#4CAF50]'
            }`}
          />
        </div>

        <div>
          <Label htmlFor="date" className="text-gray-700 mb-3 block">日付</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`h-12 rounded-lg border-gray-200 bg-gray-50 transition-all duration-200 ${
              isEditMode 
                ? 'focus:border-[#FF9800] focus:ring-[#FF9800] border-orange-200' 
                : 'focus:border-[#4CAF50] focus:ring-[#4CAF50]'
            }`}
          />
        </div>

        <div className={`pt-4 ${isEditMode ? "flex gap-3" : ""}`}>
          {isEditMode && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 rounded-lg border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              キャンセル
            </Button>
          )}
          <Button 
            type="submit" 
            className={`${isEditMode ? 'flex-1' : 'w-full'} h-12 text-lg font-medium rounded-lg ${
              isEditMode 
                ? 'bg-[#FF9800] hover:bg-[#F57C00]' 
                : 'bg-[#4CAF50] hover:bg-[#45A049]'
            } text-white border-0 transition-all duration-200`}
          >
            {isEditMode ? "更新する" : "記録する"}
          </Button>
        </div>
      </form>
    </Card>
  );
}