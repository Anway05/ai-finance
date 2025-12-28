import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const params = await searchParams;
  const editId = params?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
      <div className="mb-8 space-y-3">
        <p className="pill bg-primary/10 text-primary w-fit">Cashflow capture</p>
        <h1 className="text-4xl lg:text-5xl font-semibold text-white">{editId ? "Edit" : "Add"} transaction</h1>
        <p className="text-muted-foreground max-w-2xl">
          Log income, spending, and recurring items with clear context so dashboards stay sharp.
        </p>
      </div>
      <div className="card-surface rounded-3xl border border-border/70 shadow-2xl shadow-primary/10 p-4 sm:p-6 lg:p-8">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}