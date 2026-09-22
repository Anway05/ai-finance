"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
} as const;

type DateRangeKey = keyof typeof DATE_RANGES;

interface AccountChartProps {
  transactions: any[];
}

export const AccountChart = ({ transactions }: AccountChartProps) => {
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc: Record<string, { date: string; income: number; expense: number }>, transaction: any) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      const amt = typeof transaction.amount === "number" ? transaction.amount : parseFloat(transaction.amount || 0);
      if (transaction.type === "INCOME") acc[date].income += amt;
      else acc[date].expense += amt;
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce<{ income: number; expense: number }>(
      (acc, curr: any) => {
        acc.income += curr.income;
        acc.expense += curr.expense;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <Card className="glass-card rounded-3xl border border-border/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-bold text-foreground">
          Transaction Overview
        </CardTitle>
        <Select value={dateRange} onValueChange={(val: DateRangeKey) => setDateRange(val)}>
          <SelectTrigger className="w-[140px] bg-background/80 rounded-xl">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6 text-center bg-background/50 p-4 rounded-2xl border border-border/60">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Income</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{totals.income.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Expenses</p>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              ₹{totals.expense.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Net Balance</p>
            <p
              className={`text-xl font-extrabold mt-1 ${
                totals.income - totals.expense >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              ₹{(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, undefined]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  color: "var(--card-foreground)",
                  fontWeight: 600,
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
