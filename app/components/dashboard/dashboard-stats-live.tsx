"use client";

import type { UserStats } from "../../lib/schemas/users";
import type { TransactionStats, Wallet } from "../../lib/schemas/wallet";
import {
  useAdminTransactionStatsQuery,
  useAdminWalletQuery,
  useUserStatsQuery,
} from "../../lib/queries/wallet";
import { DashboardStats } from "./stats-cards";

interface DashboardStatsLiveProps {
  initialUserStats: UserStats;
  initialAdminWallet: Wallet;
  initialTransactionStats: TransactionStats;
  initialWalletsTotal: number;
}

export function DashboardStatsLive({
  initialUserStats,
  initialAdminWallet,
  initialTransactionStats,
  initialWalletsTotal,
}: DashboardStatsLiveProps) {
  const userStatsQuery = useUserStatsQuery(initialUserStats);
  const adminWalletQuery = useAdminWalletQuery(initialAdminWallet);
  const transactionStatsQuery = useAdminTransactionStatsQuery(
    initialTransactionStats
  );

  const userStats = userStatsQuery.data ?? initialUserStats;
  const adminWallet = adminWalletQuery.data ?? initialAdminWallet;
  const transactionStats =
    transactionStatsQuery.data ?? initialTransactionStats;

  return (
    <DashboardStats
      userStats={userStats}
      adminWallet={adminWallet}
      transactionStats={transactionStats}
      walletsTotal={initialWalletsTotal}
    />
  );
}
