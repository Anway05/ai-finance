import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account: any) => account.isDefault);

  const totalBalance =
    accounts?.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance || 0), 0) || 0;
  const income =
    transactions
      ?.filter((t: any) => t.type === "INCOME")
      .reduce((s: number, t: any) => s + parseFloat(t.amount || 0), 0) || 0;
  const expense =
    transactions
      ?.filter((t: any) => t.type === "EXPENSE")
      .reduce((s: number, t: any) => s + parseFloat(t.amount || 0), 0) || 0;
  const netFlow = income - expense;

  const metricCards = [
    {
      label: "Total Balance",
      value: `₹${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: `${accounts.length} active account${accounts.length === 1 ? "" : "s"}`,
      icon: Wallet,
      accent: "text-violet-600 dark:text-violet-400",
      glow: "shadow-[0_10px_30px_rgba(139,92,246,0.12)]",
    },
    {
      label: "Total Income",
      value: `₹${income.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: "Lifetime earnings tracked",
      icon: ArrowUpRight,
      accent: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-[0_10px_30px_rgba(16,185,129,0.12)]",
    },
    {
      label: "Total Expenses",
      value: `-₹${expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: "Lifetime spending tracked",
      icon: ArrowDownRight,
      accent: "text-rose-600 dark:text-rose-400",
      glow: "shadow-[0_10px_30px_rgba(244,63,94,0.12)]",
    },
    {
      label: "Net Flow",
      value: `${netFlow >= 0 ? "+" : "-"}₹${Math.abs(netFlow).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      hint: netFlow >= 0 ? "Positive momentum" : "Watch your burn",
      icon: Activity,
      accent: netFlow >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400",
      glow: "shadow-[0_10px_30px_rgba(99,102,241,0.12)]",
    },
  ];

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8">
      {/* Cockpit Header Card */}
      <div className="glass-card rounded-3xl border border-border/80 p-6 lg:p-8 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-fuchsia-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="pill">Control Center</div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Your Financial Cockpit
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base">
              Live account balances, budget guardrails, and real-time transaction analytics in one calm view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CreateAccountDrawer>
              <Card className="glass-card rounded-2xl border border-dashed border-primary/40 cursor-pointer hover:border-primary hover:scale-[1.02] transition-all">
                <CardContent className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary min-w-[160px]">
                  <Plus className="h-4 w-4" />
                  New Account
                </CardContent>
              </Card>
            </CreateAccountDrawer>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {metricCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className={`glass-card rounded-2xl border border-border/80 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${item.glow}`}
              >
                <CardContent className="pt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      {item.label}
                    </p>
                    <Icon className={`w-4 h-4 ${item.accent}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{item.hint}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Budget & Overview */}
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

      {/* Accounts List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Accounts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle defaults, drill into transactions, or modify accounts.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.length > 0 &&
            accounts?.map((account: any) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}
