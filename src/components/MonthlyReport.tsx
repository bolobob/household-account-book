import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart3 } from "lucide-react"

interface MonthlyReportProps {
  currentDate: { year: number; month: number }
}

export function MonthlyReport({ currentDate }: MonthlyReportProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            月次レポート - {currentDate.year}年{currentDate.month}月
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            レポート機能は開発中です。
            <br />
            今後、月別・年別の支出集計とグラフ表示機能を追加予定です。
          </div>
        </CardContent>
      </Card>
    </div>
  )
}