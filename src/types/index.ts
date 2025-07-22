export * from './database.types'
import { Expense, Budget } from './database.types'

// 追加の型定義
export interface MonthlyData {
  year: number
  month: number
  budget: number
  totalExpenses: number
  remaining: number
  progress: number
}

export interface ExpenseWithId extends Expense {
  id: string
}

export interface BudgetWithId extends Budget {
  id: string
}