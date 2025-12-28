"use client";

import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/account";

export function DeleteAccountButton({ accountId }) {
  const router = useRouter();
  const { loading, fn: deleteFn, data, error } = useFetch(deleteAccount);

  const onDelete = async () => {
    const ok = window.confirm(
      "Delete this account? This will also remove its transactions."
    );
    if (!ok) return;

    const res = await deleteFn(accountId);
    if (res?.success) {
      toast.success("Account deleted");
      router.push("/dashboard");
    }
  };

  return (
    <Button variant="destructive" onClick={onDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete Account"}
    </Button>
  );
}
