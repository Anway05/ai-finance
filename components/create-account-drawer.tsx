"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/lib/schema";

export interface CreateAccountDrawerProps {
  children?: React.ReactNode;
}

export function CreateAccountDrawer({ children }: CreateAccountDrawerProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data: any) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="border-border/80 bg-card/95 backdrop-blur-md">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Create New Account
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-foreground"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="bg-background/80 border-border/80 rounded-xl"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{String(errors.name.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-foreground"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value: "CURRENT" | "SAVINGS") => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="bg-background/80 border-border/80 rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/80 bg-card">
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500 font-medium">{String(errors.type.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-semibold text-foreground"
              >
                Initial Balance (₹)
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-background/80 border-border/80 rounded-xl"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500 font-medium">{String(errors.balance.message)}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-4">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  Set as Default Account
                </label>
                <p className="text-xs text-muted-foreground">
                  This account will be selected by default for new transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1 rounded-xl">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl"
                disabled={Boolean(createAccountLoading)}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
