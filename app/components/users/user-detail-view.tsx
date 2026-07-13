import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { AdminWallet } from "../../lib/schemas/wallet";
import type { User } from "../../lib/schemas/users";
import { formatCurrency, formatDate } from "../../lib/utils/format";
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

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Carteira
          </h2>
          {wallet ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Saldo</dt>
                <dd
                  className="text-lg font-semibold text-accent"
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {formatCurrency(wallet.balance, wallet.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID da carteira</dt>
                <dd className="font-mono text-xs truncate max-w-[180px]">
                  {wallet.id}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Carteira não encontrada para este usuário.
            </p>
          )}

          {wallet && (
            <Link
              href={`/saldo?email=${encodeURIComponent(user.email)}`}
              className="inline-flex text-sm font-medium text-accent hover:underline"
            >
              Adicionar saldo →
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
