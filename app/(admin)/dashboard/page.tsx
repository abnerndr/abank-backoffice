import { DashboardStatsLive } from "../../components/dashboard/dashboard-stats-live";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getUserStatsAction } from "../../lib/actions/users";
import {
  getAdminTransactionStatsAction,
  getAdminWalletAction,
  getAdminWalletsAction,
} from "../../lib/actions/wallet";

export default async function DashboardPage() {
  const [statsResult, walletResult, walletsResult, transactionStatsResult] =
    await Promise.all([
      getUserStatsAction(),
      getAdminWalletAction(),
      getAdminWalletsAction({ page: 1, limit: 1 }),
      getAdminTransactionStatsAction(),
    ]);

  const error =
    (!statsResult.ok && statsResult.error) ||
    (!walletResult.ok && walletResult.error) ||
    (!walletsResult.ok && walletsResult.error) ||
    (!transactionStatsResult.ok && transactionStatsResult.error);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema ABank"
      />

      {error ? (
        <ErrorBox msg={error} />
      ) : statsResult.ok &&
        walletResult.ok &&
        walletsResult.ok &&
        transactionStatsResult.ok ? (
        <DashboardStatsLive
          initialUserStats={statsResult.data}
          initialAdminWallet={walletResult.data}
          initialTransactionStats={transactionStatsResult.data}
          initialWalletsTotal={walletsResult.data.total}
        />
      ) : null}
    </div>
  );
}
