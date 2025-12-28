import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  const totalBalance =
    accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0) || 0;
  const income =
    transactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0) || 0;
  const expense =
    transactions
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0) || 0;
  const netFlow = income - expense;

  const metricCards = [
    {
      label: "Total balance",
      value: `₹${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: `${accounts.length} accounts live`,
      accent: "from-emerald-500/25 via-transparent to-emerald-400/5",
      glow: "shadow-[0_10px_40px_rgba(16,185,129,0.18)]",
    },
    {
      label: "Income (all time)",
      value: `₹${income.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: "Synced from recent activity",
      accent: "from-cyan-400/25 via-transparent to-emerald-300/10",
      glow: "shadow-[0_10px_40px_rgba(34,211,238,0.18)]",
    },
    {
      label: "Expense (all time)",
      value: `-₹${expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: "Spending across accounts",
      accent: "from-amber-400/25 via-transparent to-orange-500/10",
      glow: "shadow-[0_10px_40px_rgba(251,191,36,0.18)]",
    },
    {
      label: "Net flow",
      value: `${netFlow >= 0 ? "+" : "-"}₹${Math.abs(netFlow).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: netFlow >= 0 ? "Positive momentum" : "Watch your burn",
      accent: netFlow >= 0
        ? "from-emerald-400/25 via-transparent to-sky-400/10"
        : "from-rose-500/25 via-transparent to-orange-500/10",
      glow: netFlow >= 0
        ? "shadow-[0_10px_40px_rgba(52,211,153,0.2)]"
        : "shadow-[0_10px_40px_rgba(248,113,113,0.2)]",
    },
  ];

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-10">
      <div className="card-surface rounded-3xl border border-border/70 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <p className="pill bg-secondary/70 text-secondary-foreground">Control center</p>
            <h1 className="text-3xl lg:text-4xl font-semibold text-white">Your financial cockpit</h1>
            <p className="text-muted-foreground max-w-2xl">Live balances, budget guardrails, and transaction intelligence in one calm view.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CreateAccountDrawer>
              <Card className="card-surface rounded-2xl border border-dashed border-border/60 cursor-pointer hover:border-primary/60 transition">
                <CardContent className="flex items-center gap-2 px-4 py-3 text-sm text-primary">
                  <Plus className="h-4 w-4" />
                  New account
                </CardContent>
              </Card>
            </CreateAccountDrawer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {metricCards.map((item) => (
            <Card
              key={item.label}
              className={`card-surface rounded-2xl border border-border/70 relative overflow-hidden ${item.glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80`} />
              <div className="absolute -inset-px rounded-3xl border border-white/5 opacity-60" />
              <CardContent className="relative pt-5 space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        </div>
        <div className="lg:col-span-2">
          <DashboardOverview
            accounts={accounts}
            transactions={transactions || []}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="pill bg-secondary/70 text-secondary-foreground">Accounts</p>
            <p className="text-sm text-muted-foreground mt-2">Toggle defaults, drill into movements, or add new accounts.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.length > 0 &&
            accounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}