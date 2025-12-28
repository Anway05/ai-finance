"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
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

export const AccountCard = ({ account }) => {

    const { name, type, balance, id, isDefault } = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (e) => {
        e.preventDefault();

        if(isDefault) {
            toast.warning("You need atleast 1 default account");
            return;
        }

        await updateDefaultFn(id);
    };

    useEffect(() => {
        if(updatedAccount?.success){
            toast.success("Default account updated successfully");
        }
    }, [updatedAccount]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to update default account");
        }
    }, [error]);

return (
    <Card className="card-surface rounded-2xl border border-border/70 hover:border-primary/50 transition group relative overflow-hidden">
      <Link href={`/account/${id}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/2 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute -inset-px rounded-3xl border border-primary/20 opacity-0 group-hover:opacity-100 blur-[1px] transition" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.22),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(244,171,72,0.18),transparent_32%)]" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-white capitalize">
              {name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{type.charAt(0) + type.slice(1).toLowerCase()} account</p>
          </div>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-semibold text-white">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-2.5 w-2.5 rounded-full ${isDefault ? "bg-primary" : "bg-muted-foreground/40"}`} />
            {isDefault ? "Default account" : "Tap to set as default"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-teal-300" />
            Income ready
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-amber-300" />
            Expense watch
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
