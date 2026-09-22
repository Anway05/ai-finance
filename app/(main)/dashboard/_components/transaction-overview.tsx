"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#3b82f6",
  "#a855f7",
];

interface DashboardOverviewProps {
  accounts: any[];
  transactions: any[];
}

export function DashboardOverview({ accounts, transactions }: DashboardOverviewProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (tx) => tx.accountId === selectedAccountId
  );

  const recentTransactions = [...accountTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc: Record<string, number>, transaction) => {
    const category = transaction.category || "other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += typeof transaction.amount === "number" ? transaction.amount : parseFloat(transaction.amount || 0);
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Activity Card */}
      <Card className="glass-card equal-card rounded-3xl border border-border/80 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-bold text-foreground">
            Recent Activity
          </CardTitle>
          {accounts.length > 0 && (
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="w-[160px] bg-background/80 rounded-xl h-9 text-xs font-semibold">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-border/60 hover:bg-background/80 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground leading-none capitalize">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <div
                      className={cn(
                        "flex items-center px-2.5 py-1 rounded-full border",
                        transaction.type === "EXPENSE"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                      )}
                      ₹{(typeof transaction.amount === "number" ? transaction.amount : parseFloat(transaction.amount || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expense Breakdown */}
      <Card className="glass-card equal-card rounded-3xl border border-border/80 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5 relative">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              No expenses recorded this month
            </p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    fill="#8b5cf6"
                    label={(entry: any) => `${entry.name}: ₹${entry.value?.toFixed ? entry.value.toFixed(0) : entry.value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `₹${Number(value).toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      color: "var(--card-foreground)",
                      fontWeight: 600,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
