"use client";

import Link from "next/link";
import type { AdminWallet } from "../../lib/schemas/wallet";
import { useUserWalletQuery } from "../../lib/queries/wallet";
import { formatCurrency } from "../../lib/utils/format";
import { Card } from "../shared";

interface UserWalletCardProps {
  userId: string;
  userEmail: string;
  initialWallet: AdminWallet | null;
}

export function UserWalletCard({
  userId,
  userEmail,
  initialWallet,
}: UserWalletCardProps) {
  const walletQuery = useUserWalletQuery(userId, initialWallet ?? undefined);
  const wallet = walletQuery.data ?? initialWallet;

  if (!wallet) {
    return (
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Carteira
        </h2>
        <p className="text-sm text-muted-foreground">
          Este usuário ainda não possui carteira cadastrada.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Carteira
      </h2>
      <div
        className="text-3xl font-bold text-accent"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {formatCurrency(wallet.balance, wallet.currency)}
      </div>
      <p className="text-xs text-muted-foreground">
        Saldo atualizado em tempo real
      </p>
      <Link
        href={`/saldo?email=${encodeURIComponent(userEmail)}`}
        className="inline-flex text-sm text-accent hover:underline"
      >
        Adicionar saldo
      </Link>
    </Card>
  );
}
