import {
  ArrowLeftRight,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { UserStats } from "../../lib/schemas/users";
import type { TransactionStats, Wallet as WalletType } from "../../lib/schemas/wallet";
import { formatCurrency } from "../../lib/utils/format";
import { Card } from "../shared";

interface DashboardStatsProps {
  userStats: UserStats;
  adminWallet: WalletType;
  transactionStats: TransactionStats;
  walletsTotal: number;
}

export function DashboardStats({
  userStats,
  adminWallet,
  transactionStats,
  walletsTotal,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total de usuários",
      value: String(userStats.total),
      sub: `${userStats.verified} verificados · ${userStats.unverified} pendentes`,
      icon: Users,
    },
    {
      label: "Carteiras ativas",
      value: String(walletsTotal),
      sub: "Contas com carteira cadastrada",
      icon: Wallet,
    },
    {
      label: "Saldo admin",
      value: formatCurrency(adminWallet.balance, adminWallet.currency),
      sub: "Disponível para transferências",
      icon: TrendingUp,
    },
    {
      label: "Estornos pendentes",
      value: String(transactionStats.pendingRefunds),
      sub: `${transactionStats.pendingRefunds} solicitação(ões) · ${transactionStats.total} transações no total`,
      icon: ArrowLeftRight,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, sub, icon: Icon }) => (
        <Card key={label} className="p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
            <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
              <Icon size={16} className="text-accent" />
            </div>
          </div>
          <div
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {value}
          </div>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </Card>
      ))}
    </div>
  );
}
