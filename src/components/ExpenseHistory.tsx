import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2, Receipt } from "lucide-react"
import { Expense } from "@/types"

interface ExpenseHistoryProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

export function ExpenseHistory({ expenses, onDeleteExpense }: ExpenseHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            支出履歴
          </div>
          <div className="text-lg font-bold text-gray-900">
            合計: ¥{totalAmount.toLocaleString()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            まだ支出が記録されていません
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    {formatDate(expense.date)}
                  </div>
                  <div className="font-medium">
                    ¥{expense.amount.toLocaleString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}