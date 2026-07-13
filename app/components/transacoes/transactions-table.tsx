"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useCreateRefundRequestMutation } from "../../lib/mutations/wallet";
import { useAdminTransactionsQuery } from "../../lib/queries/wallet";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_LABELS,
  isReversible,
  type TransactionList,
} from "../../lib/schemas/wallet";
import { formatCurrency, formatDate } from "../../lib/utils/format";
import {
  Badge,
  Card,
  EmptyState,
  buttonPrimaryClassName,
  buttonSecondaryClassName,
} from "../shared";

function statusVariant(
  status: TransactionList["transactions"][number]["status"]
): "default" | "success" | "warning" | "destructive" {
  return status === "REVERSED" ? "warning" : "success";
}

function typeVariant(
  type: TransactionList["transactions"][number]["type"]
): "default" | "success" | "warning" | "destructive" {
  if (type === "REVERSAL") return "destructive";
  if (type === "DEPOSIT") return "success";
  return "default";
}

export function TransactionsTable({
  initialData,
}: {
  initialData: TransactionList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || initialData.page;
  const limit = initialData.limit;

  const transactionsQuery = useAdminTransactionsQuery(
    currentPage,
    limit,
    initialData
  );
  const createRefundMutation = useCreateRefundRequestMutation({
    transactionPage: currentPage,
    transactionLimit: limit,
  });
  const data = transactionsQuery.data ?? initialData;

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`/transacoes?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleRequestRefund = useCallback(
    (transactionId: string, amount: string) => {
      if (
        !confirm(
          `Solicitar estorno de ${formatCurrency(amount)}? A solicitação será enviada para análise.`
        )
      ) {
        return;
      }

      createRefundMutation.mutate({ transactionId });
    },
    [createRefundMutation]
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.total} transação(ões) no total
          </p>
          <p className="text-xs text-muted-foreground">
            Página {data.page} de {totalPages}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Solicitante
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Data
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  ID
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="Nenhuma transação encontrada." />
                  </td>
                </tr>
              ) : (
                data.transactions.map((tx) => {
                  const canRequestRefund =
                    isReversible(tx) && !tx.pendingRefundRequestId;

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {tx.requestedByUserEmail ?? "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={typeVariant(tx.type)}>
                          {TRANSACTION_TYPE_LABELS[tx.type]}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3 font-medium"
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                        }}
                      >
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(tx.status)}>
                          {TRANSACTION_STATUS_LABELS[tx.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground truncate max-w-[180px]"
                        title={tx.id}
                      >
                        {tx.id}
                      </td>
                      <td className="px-4 py-3">
                        {canRequestRefund ? (
                          <button
                            type="button"
                            disabled={createRefundMutation.isPending}
                            onClick={() =>
                              handleRequestRefund(tx.id, tx.amount)
                            }
                            className={`${buttonPrimaryClassName()} !py-1.5 !px-3 !text-xs`}
                          >
                            {createRefundMutation.isPending ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                            Solicitar estorno
                          </button>
                        ) : tx.pendingRefundRequestId ? (
                          <Badge variant="warning">Estorno solicitado</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => goToPage(data.page - 1)}
              className={buttonSecondaryClassName()}
            >
              Anterior
            </button>
            <span className="text-xs text-muted-foreground">
              {data.transactions.length} de {data.total}
            </span>
            <button
              type="button"
              disabled={data.page >= totalPages}
              onClick={() => goToPage(data.page + 1)}
              className={buttonSecondaryClassName()}
            >
              Próxima
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
