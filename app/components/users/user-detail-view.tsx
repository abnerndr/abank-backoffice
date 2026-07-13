import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { AdminWallet } from "../../lib/schemas/wallet";
import type { User } from "../../lib/schemas/users";
import { formatDate } from "../../lib/utils/format";
import { UserWalletCard } from "./user-wallet-card";
import { Badge, Card, PageHeader } from "../shared";
import { VerifyUserButton } from "./verify-user-button";

export function UserDetailView({
  user,
  wallet,
}: {
  user: User;
  wallet: AdminWallet | null;
}) {
  return (
    <div>
      <Link
        href="/usuarios"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={14} />
        Voltar para usuários
      </Link>

      <PageHeader
        title={user.name ?? user.email}
        description={user.name ? user.email : undefined}
        action={
          <VerifyUserButton userId={user.id} isVerified={user.isVerified} />
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Informações
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={user.isVerified ? "success" : "warning"}>
                  {user.isVerified ? "Verificado" : "Pendente"}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Roles</dt>
              <dd className="font-mono text-xs">
                {user.roles.map((r) => r.name).join(", ") || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cadastro</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Atualização</dt>
              <dd>{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <UserWalletCard
          userId={user.id}
          userEmail={user.email}
          initialWallet={wallet}
        />
      </div>
    </div>
  );
}
