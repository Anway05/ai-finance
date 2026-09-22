"use client";

import React, { useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { updateDefaultAccount } from "@/actions/account";

export interface AccountCardProps {
  key?: React.Key;
  account: {
    id: string;
    name: string;
    type: string;
    balance: number | string;
    isDefault: boolean;
  };
}

export const AccountCard = ({ account }: AccountCardProps) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  const numBalance = typeof balance === "number" ? balance : parseFloat(balance || "0");

  return (
    <Card className="glass-card rounded-2xl border border-border/80 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
      <Link href={`/account/${id}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-bold text-foreground capitalize">
              {name}
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={Boolean(updateDefaultLoading)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-extrabold text-foreground">
            ₹{numBalance.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isDefault ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
            {isDefault ? "Default Account" : "Tap switch to set as default"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs font-semibold text-muted-foreground pt-2 border-t border-border/60">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
            Income Ready
          </div>
          <div className="flex items-center text-violet-600 dark:text-violet-400">
            <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
            Expense Tracked
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
