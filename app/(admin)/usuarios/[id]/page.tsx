import { UserDetailView } from "../../../components/users/user-detail-view";
import { ErrorBox } from "../../../components/shared";
import { getUserByIdAction } from "../../../lib/actions/users";
import { getUserWalletAction } from "../../../lib/actions/wallet";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  const [userResult, walletResult] = await Promise.all([
    getUserByIdAction(id),
    getUserWalletAction(id),
  ]);

  if (!userResult.ok) {
    return <ErrorBox msg={userResult.error} />;
  }

  const wallet = walletResult.ok ? walletResult.data : null;

  return <UserDetailView user={userResult.data} wallet={wallet} />;
}
