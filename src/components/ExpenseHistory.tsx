import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { MoreHorizontal, Edit2, Trash2, Edit } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  amount: number;
  date: string;
}

interface ExpenseHistoryProps {
  expenses: Expense[];
  year: number;
  month: number;
  editingExpenseId: string | null;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export function ExpenseHistory({ 
  expenses, 
  year, 
  month,
  editingExpenseId,
  onEditExpense, 
  onDeleteExpense 
}: ExpenseHistoryProps) {
  // 指定された年月の支出をフィルタリング
  const monthlyExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });

  // 日付順にソート（新しい順）
  const sortedExpenses = monthlyExpenses.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}日`;
  };

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  const totalAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`${expense.amount.toLocaleString()}円の支出を削除しますか？`)) {
      onDeleteExpense(expense.id);
      toast.success("支出を削除しました");
    }
  };

  const handleEdit = (expense: Expense) => {
    onEditExpense(expense);
    toast.info("編集モードに切り替えました");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">
            {year}年{monthNames[month - 1]}の支出
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">合計</div>
            <div className="text-lg font-medium text-[#4CAF50]">
              ¥{totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="divide-y max-h-80 overflow-y-auto">
        {sortedExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {year}年{monthNames[month - 1]}の支出はありません
          </div>
        ) : (
          sortedExpenses.map((expense) => {
            const isEditing = editingExpenseId === expense.id;
            
            return (
              <div 
                key={expense.id} 
                className={`px-6 py-4 transition-all duration-200 group relative ${
                  isEditing 
                    ? 'bg-orange-50 border-l-4 border-l-[#FF9800] shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* 編集中のハイライト表示 */}
                {isEditing && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-[#FF9800] text-white hover:bg-[#F57C00] text-xs flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      編集中
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      isEditing ? 'bg-[#FF9800]' : 'bg-[var(--app-primary)]'
                    }`}></div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {formatDate(expense.date)}
                      </div>
                      <div className={`text-lg font-medium transition-colors duration-200 ${
                        isEditing ? 'text-[#FF9800]' : 'text-gray-900'
                      }`}>
                        ¥{expense.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <div className="text-xs text-[#FF9800] font-medium mr-2">
                        編集中
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                            isEditing 
                              ? 'opacity-100 hover:bg-orange-100' 
                              : 'opacity-0 group-hover:opacity-100 hover:bg-gray-100'
                          }`}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          <span className="sr-only">メニューを開く</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem 
                          onClick={() => handleEdit(expense)}
                          className="cursor-pointer"
                          disabled={isEditing}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(expense)}
                          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}