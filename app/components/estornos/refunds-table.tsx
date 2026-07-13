"use client";

import { Check, Loader2, X } from "lucide-react";
import { useCallback } from "react";
import {
  useApproveRefundRequestMutation,
  useRejectRefundRequestMutation,
} from "../../lib/mutations/wallet";
import { useAdminRefundRequestsQuery } from "../../lib/queries/wallet";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_LABELS,
  type RefundRequest,
  type RefundRequestList,
} from "../../lib/schemas/wallet";
import { formatCurrency, formatDate } from "../../lib/utils/format";
import {
  Badge,
  Card,
  EmptyState,
  buttonPrimaryClassName,
  buttonDestructiveClassName,
} from "../shared";

export function RefundsTable({
  initialData,
}: {
  initialData: RefundRequestList;
}) {
  const refundRequestsQuery = useAdminRefundRequestsQuery(1, 50, initialData);
  const approveMutation = useApproveRefundRequestMutation({
    refundPage: 1,
    refundLimit: 50,
  });
  const rejectMutation = useRejectRefundRequestMutation({
    refundPage: 1,
    refundLimit: 50,
  });
  const data = refundRequestsQuery.data ?? initialData;

  const handleApprove = useCallback(
    (request: RefundRequest) => {
      const tx = request.transaction;
      if (
        !confirm(
          `Confirmar estorno de ${formatCurrency(tx.amount)}? Esta ação não pode ser desfeita.`
        )
      ) {
        return;
      }

      approveMutation.mutate(request.id);
    },
    [approveMutation]
  );

  const handleReject = useCallback(
    (requestId: string) => {
      if (!confirm("Rejeitar esta solicitação de estorno?")) {
        return;
      }

      rejectMutation.mutate(requestId);
    },
    [rejectMutation]
  );

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Card>
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {data.total} solicitação(ões) pendente(s) de estorno
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
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Motivo
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Data
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Status transação
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data.refundRequests.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState message="Nenhuma solicitação de estorno pendente." />
                </td>
              </tr>
            ) : (
              data.refundRequests.map((request) => {
                const tx = request.transaction;
                return (
                  <tr
                    key={request.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {request.requestedByUserEmail ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono truncate max-w-[220px]">
                        {request.requestedByUserId}
                      </div>
                    </td>
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
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground max-w-[240px] truncate">
                      {request.reason ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {formatDate(request.createdAt)}
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
                          disabled={isPending}
                          onClick={() => handleApprove(request)}
                          className={`${buttonPrimaryClassName()} !py-1.5 !px-3 !text-xs`}
                        >
                          {approveMutation.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          Aprovar
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleReject(request.id)}
                          className={`${buttonDestructiveClassName()} !py-1.5 !px-3 !text-xs`}
                        >
                          <X size={12} />
                          Rejeitar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data.total > data.limit && (
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          Exibindo {data.refundRequests.length} de {data.total} solicitações
        </div>
      )}
    </Card>
  );
}
