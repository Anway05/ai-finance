"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
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

export function BudgetProgress({ initialBudget, currentExpenses}) {
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
  }

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
        if(error){
            toast.error(error.message || "Failed to update budget.");
        }
    }, [error]);

return (
    <Card className="card-surface rounded-3xl border border-border/70 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(244,171,72,0.16),transparent_30%)]" />
      <div className="absolute -inset-px rounded-[28px] border border-white/5 opacity-60" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-2">
          <p className="pill bg-primary/10 text-primary">Budget guardrail</p>
          <CardTitle className="text-xl font-semibold text-white">
            Default account budget
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Keep the month on track with a live budget dial.
          </CardDescription>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  {initialBudget
                    ? `₹${currentExpenses.toFixed(2)} of ₹${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 relative">
        {initialBudget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Spending</span>
              <span>{percentUsed.toFixed(1)}% used</span>
            </div>
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-destructive"
                  : percentUsed >= 75
                    ? "bg-amber-400"
                    : "bg-primary"
              }`}
            />
          </div>
        )}
        {!initialBudget && (
          <p className="text-sm text-muted-foreground">
            Set a budget to start tracking this account.
          </p>
        )}
      </CardContent>
    </Card>
  );
}