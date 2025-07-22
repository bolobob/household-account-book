'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut } from 'lucide-react'
import { BudgetDisplay } from './BudgetDisplay'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseHistory } from './ExpenseHistory'
import { MonthNavigation } from './MonthNavigation'
import { MonthlyReport } from './MonthlyReport'
import { Expense, Budget } from '@/types'
import { supabase } from '@/lib/supabase'

export function HouseholdApp() {
  const { user, signOut } = useAuth()
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    }
  })
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // 現在月の支出を取得
      const startDate = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-01`
      const endDate = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-31`
      
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      // 現在月の予算を取得
      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('year', currentDate.year)
        .eq('month', currentDate.month)
        .single()

      setExpenses(expensesData || [])
      setBudget(budgetData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, currentDate])

  const handleAddExpense = async (amount: number, date: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          amount,
          date,
        }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setExpenses(prev => [data, ...prev])
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const handleSetBudget = async (amount: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert([{
          user_id: user.id,
          year: currentDate.year,
          month: currentDate.month,
          amount,
        }])
        .select()
        .single()

      if (error) throw error

      setBudget(data)
    } catch (error) {
      console.error('Error setting budget:', error)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetAmount = budget?.amount || 0
  const remaining = budgetAmount - totalExpenses
  const progress = budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">シンプル家計簿</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="main" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">メイン</TabsTrigger>
            <TabsTrigger value="report">レポート</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main" className="space-y-6">
            <MonthNavigation
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />

            <BudgetDisplay
              budget={budgetAmount}
              totalExpenses={totalExpenses}
              remaining={remaining}
              progress={progress}
              onSetBudget={handleSetBudget}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <ExpenseForm onAddExpense={handleAddExpense} />
              <ExpenseHistory 
                expenses={expenses} 
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <MonthlyReport currentDate={currentDate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}