"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, ShieldAlert } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

interface BudgetProgressProps {
  initialBudget?: {
    id?: string;
    amount: number;
  } | null;
  currentExpenses: number;
}

export function BudgetProgress({ initialBudget, currentExpenses }: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget ? (currentExpenses / initialBudget.amount) * 100 : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget.");
    }
  }, [error]);

  return (
    <Card className="glass-card equal-card rounded-3xl border border-border/80 relative overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-2">
          <div className="pill">
            <ShieldAlert className="w-3.5 h-3.5 text-violet-500" />
            Budget Guardrail
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            Monthly Budget
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Keep your spending on track with real-time budget limits.
          </CardDescription>

          <div className="flex items-center gap-2 pt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32 h-9 text-sm"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={Boolean(isLoading)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={Boolean(isLoading)}
                  className="h-9 w-9 rounded-xl border-emerald-500/30"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={Boolean(isLoading)}
                  className="h-9 w-9 rounded-xl"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
                  {initialBudget
                    ? `₹${currentExpenses.toFixed(2)} of ₹${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 rounded-lg"
                >
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 relative pt-2">
        {initialBudget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Budget Usage</span>
              <span
                className={
                  percentUsed >= 90
                    ? "text-rose-500 font-bold"
                    : percentUsed >= 75
                    ? "text-amber-500 font-bold"
                    : "text-emerald-500 font-bold"
                }
              >
                {percentUsed.toFixed(1)}% used
              </span>
            </div>
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-rose-500"
                  : percentUsed >= 75
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600"
              }`}
            />
          </div>
        )}
        {!initialBudget && (
          <p className="text-sm text-muted-foreground">
            Click pencil icon to set a monthly budget for this account.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
