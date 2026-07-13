import { DashboardStats } from "../../components/dashboard/stats-cards";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getUserStatsAction } from "../../lib/actions/users";
import {
  getAdminTransactionsAction,
  getAdminWalletAction,
  getAdminWalletsAction,
} from "../../lib/actions/wallet";

export default async function DashboardPage() {
  const [statsResult, walletResult, walletsResult, transactionsResult] =
    await Promise.all([
      getUserStatsAction(),
      getAdminWalletAction(),
      getAdminWalletsAction({ page: 1, limit: 1 }),
      getAdminTransactionsAction({ page: 1, limit: 50 }),
    ]);

  const error =
    (!statsResult.ok && statsResult.error) ||
    (!walletResult.ok && walletResult.error) ||
    (!walletsResult.ok && walletsResult.error) ||
    (!transactionsResult.ok && transactionsResult.error);

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
        transactionsResult.ok ? (
        <DashboardStats
          userStats={statsResult.data}
          adminWallet={walletResult.data}
          transactions={transactionsResult.data}
          walletsTotal={walletsResult.data.total}
        />
      ) : null}
    </div>
  );
}
