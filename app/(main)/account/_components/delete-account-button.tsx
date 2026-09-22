"use client";

import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/account";
import { Trash2 } from "lucide-react";

interface DeleteAccountButtonProps {
  accountId: string;
}

export function DeleteAccountButton({ accountId }: DeleteAccountButtonProps) {
  const router = useRouter();
  const { loading, fn: deleteFn, error } = useFetch(deleteAccount);

  const onDelete = async () => {
    const ok = window.confirm(
      "Delete this account? This will also remove all transactions associated with it."
    );
    if (!ok) return;

    const res = await deleteFn(accountId);
    if (res?.success) {
      toast.success("Account deleted successfully");
      router.push("/dashboard");
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={onDelete}
      disabled={Boolean(loading)}
      className="gap-2 rounded-xl text-xs font-semibold"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {loading ? "Deleting..." : "Delete Account"}
    </Button>
  );
}
