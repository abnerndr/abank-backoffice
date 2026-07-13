"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserStatsAction } from "../actions/users";
import {
  getAdminRefundRequestsAction,
  getAdminTransactionStatsAction,
  getAdminTransactionsAction,
  getAdminWalletAction,
  getUserWalletAction,
} from "../actions/wallet";
import type { UserStats } from "../schemas/users";
import type {
  AdminWallet,
  RefundRequestList,
  TransactionList,
  TransactionStats,
  Wallet,
} from "../schemas/wallet";
import type { ActionResult } from "../types/common";
import { balanceQueryOptions, transactionsQueryOptions } from "./config";
import { queryKeys } from "./keys";

function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

export function useAdminWalletQuery(initialData?: Wallet) {
  return useQuery({
    queryKey: queryKeys.adminWallet,
    queryFn: async () => unwrap(await getAdminWalletAction()),
    initialData,
    ...balanceQueryOptions,
  });
}

export function useUserWalletQuery(
  userId: string,
  initialData?: AdminWallet | null
) {
  return useQuery({
    queryKey: queryKeys.userWallet(userId),
    queryFn: async () => unwrap(await getUserWalletAction(userId)),
    initialData: initialData ?? undefined,
    enabled: !!userId,
    ...balanceQueryOptions,
  });
}

export function useAdminTransactionsQuery(
  page: number,
  limit: number,
  initialData?: TransactionList
) {
  return useQuery({
    queryKey: queryKeys.adminTransactions(page, limit),
    queryFn: async () =>
      unwrap(await getAdminTransactionsAction({ page, limit })),
    initialData,
    ...transactionsQueryOptions,
  });
}

export function useAdminTransactionStatsQuery(initialData?: TransactionStats) {
  return useQuery({
    queryKey: queryKeys.adminTransactionStats,
    queryFn: async () => unwrap(await getAdminTransactionStatsAction()),
    initialData,
    ...transactionsQueryOptions,
  });
}

export function useAdminRefundRequestsQuery(
  page: number,
  limit: number,
  initialData?: RefundRequestList
) {
  return useQuery({
    queryKey: queryKeys.adminRefundRequests(page, limit),
    queryFn: async () =>
      unwrap(await getAdminRefundRequestsAction({ page, limit })),
    initialData,
    ...transactionsQueryOptions,
  });
}

export function useUserStatsQuery(initialData?: UserStats) {
  return useQuery({
    queryKey: queryKeys.userStats,
    queryFn: async () => unwrap(await getUserStatsAction()),
    initialData,
    ...balanceQueryOptions,
  });
}
