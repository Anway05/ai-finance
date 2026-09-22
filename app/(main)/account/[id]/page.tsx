import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { DeleteAccountButton } from "../_components/delete-account-button";

interface AccountPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-4">
      <div className="glass-card rounded-3xl border border-border/80 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div>
          <div className="pill mb-2">Account Details</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight capitalize text-foreground">
            {account.name}
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-2">
          <div className="text-3xl font-extrabold text-foreground">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground font-semibold">
            {account._count.transactions} Total Transactions
          </p>
          <DeleteAccountButton accountId={account.id} />
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={
          <div className="mt-4">
            <BarLoader width="100%" color="#8b5cf6" />
          </div>
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={
          <div className="mt-4">
            <BarLoader width="100%" color="#8b5cf6" />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
