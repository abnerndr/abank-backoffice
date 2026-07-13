"use client";

import { Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { reverseTransactionAction } from "../../lib/actions/wallet";
import {
  isReversible,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_LABELS,
  type Transaction,
  type TransactionList,
} from "../../lib/schemas/wallet";
import { formatCurrency, formatDate } from "../../lib/utils/format";
import {
  Badge,
  Card,
  EmptyState,
  buttonPrimaryClassName,
  buttonDestructiveClassName,
} from "../shared";

export function RefundsTable({ initialData }: { initialData: TransactionList }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const reversibleTransactions = useMemo(
    () =>
      initialData.transactions.filter(
        (tx) => isReversible(tx) && !rejectedIds.has(tx.id)
      ),
    [initialData.transactions, rejectedIds]
  );

  const handleApprove = useCallback(
    async (transaction: Transaction) => {
      if (
        !confirm(
          `Confirmar estorno de ${formatCurrency(transaction.amount)}? Esta ação não pode ser desfeita.`
        )
      ) {
        return;
      }

      setPendingId(transaction.id);
      const result = await reverseTransactionAction(transaction.id);

      if (!result.ok) {
        toast.error(result.error);
        setPendingId(null);
        return;
      }

      toast.success("Estorno aprovado e executado com sucesso.");
      router.refresh();
      setPendingId(null);
    },
    [router]
  );

  function handleReject(transactionId: string) {
    setRejectedIds((prev) => new Set(prev).add(transactionId));
    toast.info("Estorno rejeitado para esta sessão.");
  }

  return (
    <Card>
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {reversibleTransactions.length} transação(ões) elegível(eis) para
          estorno
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Valor
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Data
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {reversibleTransactions.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="Nenhuma transação pendente de estorno." />
                </td>
              </tr>
            ) : (
              reversibleTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <Badge>{TRANSACTION_TYPE_LABELS[tx.type]}</Badge>
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                    }}
                  >
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="success">
                      {TRANSACTION_STATUS_LABELS[tx.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pendingId === tx.id}
                        onClick={() => handleApprove(tx)}
                        className={`${buttonPrimaryClassName()} !py-1.5 !px-3 !text-xs`}
                      >
                        {pendingId === tx.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        Aprovar
                      </button>
                      <button
                        type="button"
                        disabled={pendingId === tx.id}
                        onClick={() => handleReject(tx.id)}
                        className={`${buttonDestructiveClassName()} !py-1.5 !px-3 !text-xs`}
                      >
                        <X size={12} />
                        Rejeitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {initialData.total > initialData.limit && (
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          Exibindo {initialData.transactions.length} de {initialData.total}{" "}
          transações
        </div>
      )}
    </Card>
  );
}
