import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

interface AddTransactionPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AddTransactionPage({ searchParams }: AddTransactionPageProps) {
  const accounts = await getUserAccounts();
  const params = await searchParams;
  const editId = params?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <div className="mb-8 space-y-2">
        <div className="pill">Cashflow Entry</div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          {editId ? "Edit" : "Add"} Transaction
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base">
          Log income, spending, and recurring items with clear context so your financial cockpit stays sharp.
        </p>
      </div>
      <div className="glass-card rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xl">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={Boolean(editId)}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
