import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card } from "./ui/card";

interface MonthNavigationProps {
  currentYear: number;
  currentMonth: number;
  onMonthChange: (year: number, month: number) => void;
}

export function MonthNavigation({ 
  currentYear, 
  currentMonth, 
  onMonthChange
}: MonthNavigationProps) {
  const [showYearMonthSelect, setShowYearMonthSelect] = useState(false);

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      onMonthChange(currentYear - 1, 12);
    } else {
      onMonthChange(currentYear, currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      onMonthChange(currentYear + 1, 1);
    } else {
      onMonthChange(currentYear, currentMonth + 1);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Card className="p-4 mb-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-center">
        {/* 月移動ボタンと現在の年月表示 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setShowYearMonthSelect(!showYearMonthSelect)}
            className="flex items-center gap-2 h-10 px-4 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {currentYear}年{monthNames[currentMonth - 1]}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="h-10 w-10 p-0 rounded-lg border-gray-200 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 年月選択ドロップダウン */}
      {showYearMonthSelect && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-4 items-end justify-center">
            <div>
              <label className="block text-sm text-gray-600 mb-2">年</label>
              <Select 
                value={currentYear.toString()} 
                onValueChange={(value) => onMonthChange(parseInt(value), currentMonth)}
              >
                <SelectTrigger className="w-32 rounded-lg bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}年</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">月</label>
              <Select 
                value={currentMonth.toString()} 
                onValueChange={(value) => onMonthChange(currentYear, parseInt(value))}
              >
                <SelectTrigger className="w-32 rounded-lg bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}月</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowYearMonthSelect(false)}
                className="h-10 px-4 rounded-lg"
              >
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}