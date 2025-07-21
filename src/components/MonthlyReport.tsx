import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  date: string;
}

interface MonthlyReportProps {
  expenses: Expense[];
  currentYear: number;
  currentMonth: number;
}

export function MonthlyReport({ expenses, currentYear, currentMonth }: MonthlyReportProps) {
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  // 過去12ヶ月のデータを作成
  const getMonthlyData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;
      
      if (targetMonth <= 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === targetYear && 
               expenseDate.getMonth() + 1 === targetMonth;
      });

      const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      data.push({
        month: `${targetYear}年${monthNames[targetMonth - 1]}`,
        monthShort: monthNames[targetMonth - 1],
        amount: total,
        year: targetYear,
        monthNum: targetMonth
      });
    }
    return data;
  };

  const monthlyData = getMonthlyData();
  const currentMonthData = monthlyData[monthlyData.length - 1];
  const previousMonthData = monthlyData[monthlyData.length - 2];

  // 現在月の支出
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === currentYear && 
           expenseDate.getMonth() + 1 === currentMonth;
  });

  // 週別データ
  const getWeeklyData = () => {
    const weeks = [];
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    for (let week = 1; week <= 5; week++) {
      const startDay = (week - 1) * 7 + 1;
      const endDay = Math.min(week * 7, daysInMonth);
      
      if (startDay <= daysInMonth) {
        const weeklyExpenses = currentMonthExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const day = expenseDate.getDate();
          return day >= startDay && day <= endDay;
        });

        const total = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        weeks.push({
          week: `${startDay}日-${endDay}日`,
          amount: total
        });
      }
    }
    return weeks;
  };

  const weeklyData = getWeeklyData();
  const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPreviousMonth = previousMonthData ? previousMonthData.amount : 0;
  const monthlyChange = totalPreviousMonth > 0 ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 現在月のサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の支出</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalCurrentMonth.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">前月比</p>
              <p className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-600'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              monthlyChange >= 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {monthlyChange >= 0 ? (
                <TrendingUp className={`w-6 h-6 ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-600'}`} />
              ) : (
                <TrendingDown className="w-6 h-6 text-green-600" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">支出件数</p>
              <p className="text-2xl font-bold text-gray-900">{currentMonthExpenses.length}件</p>
            </div>
            <div className="w-12 h-12 bg-[#FF9800] rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* 過去12ヶ月のトレンド */}
      <Card className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">過去12ヶ月の支出トレンド</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="monthShort" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, '支出額']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.month;
                  }
                  return label;
                }}
              />
              <Bar dataKey="amount" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 現在月の週別支出 */}
      <Card className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {currentYear}年{monthNames[currentMonth - 1]}の週別支出
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`¥${value.toLocaleString()}`, '支出額']}
              />
              <Bar dataKey="amount" fill="#FF9800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}