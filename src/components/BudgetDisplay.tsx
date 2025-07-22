import { useState } from "react"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { AlertTriangle, Settings } from "lucide-react"

interface BudgetDisplayProps {
  budget: number
  totalExpenses: number
  remaining: number
  progress: number
  onSetBudget: (amount: number) => void
}

export function BudgetDisplay({ budget, totalExpenses, remaining, progress, onSetBudget }: BudgetDisplayProps) {
  const [budgetInput, setBudgetInput] = useState(budget.toString())
  const [dialogOpen, setDialogOpen] = useState(false)
  const isOverBudget = remaining < 0

  const handleSetBudget = () => {
    const amount = parseInt(budgetInput)
    if (!isNaN(amount) && amount > 0) {
      onSetBudget(amount)
      setDialogOpen(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>月予算</CardTitle>
          <div className="flex items-center gap-2">
            {isOverBudget && (
              <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                予算オーバー
              </div>
            )}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  設定
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>月予算の設定</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">予算金額（円）</label>
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <Button onClick={handleSetBudget} className="w-full">
                    設定
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {budget > 0 ? (
          <>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ¥{budget.toLocaleString()}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>使用額: ¥{totalExpenses.toLocaleString()}</span>
              <span className={isOverBudget ? "text-red-500" : "text-green-600"}>
                残り: ¥{remaining.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={Math.min(progress, 100)} 
              className="w-full h-3 mb-2"
            />
            <div className="text-right text-sm text-gray-500">
              {progress.toFixed(1)}%
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-xl text-gray-500 mb-4">予算が設定されていません</div>
            <div className="text-sm text-gray-600 mb-4">
              今月の支出: ¥{totalExpenses.toLocaleString()}
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>予算を設定</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>月予算の設定</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">予算金額（円）</label>
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <Button onClick={handleSetBudget} className="w-full">
                    設定
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}