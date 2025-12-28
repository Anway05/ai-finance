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
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];


export function DashboardOverview({ accounts, transactions }){
    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );

    // Filter transactions for selected account
    const accountTransactions = transactions.filter(
        (tx) => tx.accountId === selectedAccountId
    );

    // Get recent transactions (last 5)
    const recentTransactions = accountTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Calculate expense breakdown for current Month
    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
        t.type === "EXPENSE" &&
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
        );
    });

    // Group expenses by category
    const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
    }, {});

    // Format data for pie chart
    const pieChartData = Object.entries(expensesByCategory).map(
        ([category, amount]) => ({
            name: category,
            value: amount,
        })
    ); 

    return (
        <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-surface rounded-2xl border border-border/70 relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(244,171,72,0.12),transparent_28%)]" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold text-white">
                Recent activity
            </CardTitle>
            <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
            >
                <SelectTrigger className="w-[160px] bg-background/50">
                <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                    {account.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                    No recent transactions
                </p>
                ) : (
                recentTransactions.map((transaction) => (
                    <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-xl bg-background/40 p-3 border border-border/40"
                    >
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-white leading-none">
                        {transaction.description || "Untitled Transaction"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "PP")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <div
                        className={cn(
                            "flex items-center px-3 py-1 rounded-full",
                            transaction.type === "EXPENSE"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        )}
                        >
                        {transaction.type === "EXPENSE" ? (
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                        )}
                        ₹{transaction.amount.toFixed(2)}
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
            </CardContent>
        </Card>

        <Card className="card-surface rounded-2xl border border-border/70 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.1),transparent_32%)]" />
            <CardHeader>
            <CardTitle className="text-base font-semibold text-white">
                Monthly expense breakdown
            </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-5 relative">
            {pieChartData.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                No expenses this month
                </p>
            ) : (
                <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                    >
                        {pieChartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `₹${value.toFixed(2)}`}
                        contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
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