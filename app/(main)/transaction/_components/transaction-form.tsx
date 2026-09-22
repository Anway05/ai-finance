"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

interface AddTransactionFormProps {
  accounts: any[];
  categories: any[];
  editMode?: boolean;
  initialData?: any;
}

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}: AddTransactionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<any>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description || "",
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: Boolean(initialData.isRecurring),
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac: any) => ac.isDefault)?.id || accounts[0]?.id || "",
            category: "",
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode && editId) {
      (transactionFn as any)(editId, formData);
    } else {
      (transactionFn as any)(formData);
    }
  };

  const handleScanComplete = (scannedData: any) => {
    if (scannedData) {
      if (scannedData.amount) setValue("amount", scannedData.amount.toString());
      if (scannedData.date) setValue("date", new Date(scannedData.date));
      if (scannedData.description) setValue("description", scannedData.description);
      if (scannedData.category) setValue("category", scannedData.category);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category: any) => category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {!editMode && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Smart AI Receipt Scanner
              </p>
              <p className="text-xs text-muted-foreground">Upload or snap a receipt image to auto-fill amount, date, & description.</p>
            </div>
            <span className="text-xs font-semibold rounded-full bg-primary/15 text-primary px-3 py-1">AI Enabled</span>
          </div>
          <div>
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Transaction Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["EXPENSE", "INCOME"] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setValue("type", val);
                    const firstCategory = categories.find((c: any) => c.type === val);
                    if (firstCategory) setValue("category", firstCategory.id);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all cursor-pointer",
                    "bg-background/80 border-border/80 hover:border-primary/50",
                    type === val &&
                      "border-primary bg-primary/10 shadow-md font-bold text-primary"
                  )}
                >
                  <span className="text-sm font-bold text-foreground">
                    {val === "EXPENSE" ? "Expense" : "Income"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {val === "EXPENSE" ? "Track outgoing money" : "Record incoming money"}
                  </span>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-500 font-medium">{String(errors.type.message)}</p>}
          </div>

          {/* Amount & Account */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Amount (₹)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-background/80 rounded-xl"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 font-medium">{String(errors.amount.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Account</label>
              <Select
                onValueChange={(value) => setValue("accountId", value)}
                defaultValue={getValues("accountId")}
              >
                <SelectTrigger className="bg-background/80 rounded-xl">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (₹{parseFloat(account.balance || 0).toFixed(2)})
                    </SelectItem>
                  ))}
                  <CreateAccountDrawer>
                    <Button
                      type="button"
                      variant="ghost"
                      className="relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      + Create Account
                    </Button>
                  </CreateAccountDrawer>
                </SelectContent>
              </Select>
              {errors.accountId && (
                <p className="text-xs text-red-500 font-medium">{String(errors.accountId.message)}</p>
              )}
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Category</label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={getValues("category")}
              >
                <SelectTrigger className="bg-background/80 rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {filteredCategories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500 font-medium">{String(errors.category.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-background/80 rounded-xl h-10 border-border/80",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => selectedDate && setValue("date", selectedDate)}
                    disabled={(d) =>
                      d > new Date() || d < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-red-500 font-medium">{String(errors.date.message)}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Description</label>
            <Input
              placeholder="e.g. Monthly grocery run, client invoice, coffee..."
              className="bg-background/80 rounded-xl"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{String(errors.description.message)}</p>
            )}
          </div>
        </div>

        {/* Recurring Rules Side Panel */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-background/50 p-5 h-fit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-foreground">Recurring Rule</p>
              <p className="text-xs text-muted-foreground">Automate repeating expenses or salary credits.</p>
            </div>
            <Switch
              checked={isRecurring}
              onCheckedChange={(checked) => setValue("isRecurring", checked)}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-foreground">Repeat Interval</label>
              <Select
                onValueChange={(value: any) => setValue("recurringInterval", value)}
                defaultValue={getValues("recurringInterval")}
              >
                <SelectTrigger className="bg-background/80 rounded-xl">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.recurringInterval && (
                <p className="text-xs text-red-500 font-medium">
                  {String(errors.recurringInterval.message)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-40 rounded-xl"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-56 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
          disabled={Boolean(transactionLoading)}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}
