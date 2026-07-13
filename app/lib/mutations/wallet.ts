"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveRefundRequestAction,
  createRefundRequestAction,
  rejectRefundRequestAction,
  transferBalanceAction,
} from "../actions/wallet";
import { queryKeys } from "../queries/keys";

async function refetchBalanceData(
  queryClient: ReturnType<typeof useQueryClient>
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.adminWallet }),
    queryClient.invalidateQueries({ queryKey: queryKeys.userStats }),
    queryClient.refetchQueries({ queryKey: queryKeys.adminWallet }),
    queryClient.refetchQueries({ queryKey: queryKeys.userStats }),
  ]);
}

async function refetchTransactionsData(
  queryClient: ReturnType<typeof useQueryClient>,
  page = 1,
  limit = 50
) {
  const txKey = queryKeys.adminTransactions(page, limit);
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.adminTransactions(page, limit),
    }),
    queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] }),
    queryClient.refetchQueries({ queryKey: txKey }),
  ]);
}

async function refetchRefundRequestsData(
  queryClient: ReturnType<typeof useQueryClient>,
  page = 1,
  limit = 50
) {
  const key = queryKeys.adminRefundRequests(page, limit);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: key }),
    queryClient.invalidateQueries({ queryKey: ["admin", "refund-requests"] }),
    queryClient.refetchQueries({ queryKey: key }),
  ]);
}

async function refetchRefundRelatedData(
  queryClient: ReturnType<typeof useQueryClient>,
  options?: { transactionPage?: number; transactionLimit?: number; refundPage?: number; refundLimit?: number }
) {
  const transactionPage = options?.transactionPage ?? 1;
  const transactionLimit = options?.transactionLimit ?? 50;
  const refundPage = options?.refundPage ?? 1;
  const refundLimit = options?.refundLimit ?? 50;

  await Promise.all([
    refetchBalanceData(queryClient),
    refetchTransactionsData(queryClient, transactionPage, transactionLimit),
    refetchTransactionsData(queryClient, 1, 20),
    refetchRefundRequestsData(queryClient, refundPage, refundLimit),
    queryClient.invalidateQueries({ queryKey: queryKeys.adminTransactionStats }),
    queryClient.refetchQueries({ queryKey: queryKeys.adminTransactionStats }),
  ]);
}

export function useTransferBalanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: unknown) => {
      const result = await transferBalanceAction(input);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await Promise.all([
        refetchBalanceData(queryClient),
        refetchTransactionsData(queryClient, 1, 50),
        refetchTransactionsData(queryClient, 1, 20),
      ]);
      toast.success("Saldo transferido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Alias semântico para transferência de saldo admin → usuário. */
export const useAddBalanceMutation = useTransferBalanceMutation;

export function useCreateRefundRequestMutation(options?: {
  transactionPage?: number;
  transactionLimit?: number;
}) {
  const queryClient = useQueryClient();
  const page = options?.transactionPage ?? 1;
  const limit = options?.transactionLimit ?? 20;

  return useMutation({
    mutationFn: async ({
      transactionId,
      reason,
    }: {
      transactionId: string;
      reason?: string;
    }) => {
      const result = await createRefundRequestAction(transactionId, reason);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await refetchRefundRelatedData(queryClient, {
        transactionPage: page,
        transactionLimit: limit,
      });
      toast.success("Solicitação de estorno enviada!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useApproveRefundRequestMutation(options?: {
  refundPage?: number;
  refundLimit?: number;
}) {
  const queryClient = useQueryClient();
  const page = options?.refundPage ?? 1;
  const limit = options?.refundLimit ?? 50;

  return useMutation({
    mutationFn: async (refundRequestId: string) => {
      const result = await approveRefundRequestAction(refundRequestId);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await refetchRefundRelatedData(queryClient, {
        refundPage: page,
        refundLimit: limit,
      });
      toast.success("Estorno aprovado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRejectRefundRequestMutation(options?: {
  refundPage?: number;
  refundLimit?: number;
}) {
  const queryClient = useQueryClient();
  const page = options?.refundPage ?? 1;
  const limit = options?.refundLimit ?? 50;

  return useMutation({
    mutationFn: async (refundRequestId: string) => {
      const result = await rejectRefundRequestAction(refundRequestId);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await refetchRefundRelatedData(queryClient, {
        refundPage: page,
        refundLimit: limit,
      });
      toast.info("Solicitação de estorno rejeitada.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
