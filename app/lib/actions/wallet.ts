"use server";

import { revalidatePath } from "next/cache";
import { getErrorMessage, serverRequest } from "../api/axios";
import { API_PATHS, TEST_USER_EMAIL_PREFIX } from "../api/constants";
import {
  adminWalletListSchema,
  adminWalletSchema,
  refundRequestListSchema,
  refundRequestSchema,
  transactionListSchema,
  transactionSchema,
  transactionStatsSchema,
  transferSchema,
  walletSchema,
} from "../schemas/wallet";
import type { ActionResult } from "../types/common";
import type {
  AdminWallet,
  RefundRequest,
  RefundRequestList,
  Transaction,
  TransactionList,
  TransactionStats,
  TransferInput,
  Wallet,
} from "../schemas/wallet";

export async function getAdminWalletAction(): Promise<ActionResult<Wallet>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(API_PATHS.wallet.me);
      return walletSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getUserWalletAction(
  userId: string
): Promise<ActionResult<AdminWallet>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(
        API_PATHS.adminWallet.userWallet(userId)
      );
      return adminWalletSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getAdminWalletsAction(params?: {
  page?: number;
  limit?: number;
  excludeTestUsers?: boolean;
}): Promise<
  ActionResult<{
    wallets: AdminWallet[];
    total: number;
    page: number;
    limit: number;
  }>
> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(
        API_PATHS.adminWallet.wallets,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 20,
            excludeUserEmailPrefix:
              params?.excludeTestUsers === false
                ? undefined
                : TEST_USER_EMAIL_PREFIX,
          },
        }
      );
      return adminWalletListSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getAdminTransactionsAction(params?: {
  page?: number;
  limit?: number;
  excludeTestUsers?: boolean;
}): Promise<ActionResult<TransactionList>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(
        API_PATHS.adminWallet.transactions,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 20,
            excludeUserEmailPrefix:
              params?.excludeTestUsers === false
                ? undefined
                : TEST_USER_EMAIL_PREFIX,
          },
        }
      );
      return transactionListSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getAdminTransactionStatsAction(options?: {
  excludeTestUsers?: boolean;
}): Promise<ActionResult<TransactionStats>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(
        API_PATHS.adminWallet.transactionStats,
        {
          params: {
            excludeUserEmailPrefix:
              options?.excludeTestUsers === false
                ? undefined
                : TEST_USER_EMAIL_PREFIX,
          },
        }
      );
      return transactionStatsSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function transferBalanceAction(
  input: unknown
): Promise<ActionResult<Transaction>> {
  const parsed = transferSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.post(
        API_PATHS.wallet.transfer,
        parsed.data satisfies TransferInput
      );
      return transactionSchema.parse(response);
    });

    revalidatePath("/saldo");
    revalidatePath("/dashboard");
    revalidatePath("/estornos");
    revalidatePath("/transacoes");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function reverseTransactionAction(
  transactionId: string
): Promise<ActionResult<Transaction>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.post(
        API_PATHS.wallet.reverse(transactionId)
      );
      return transactionSchema.parse(response);
    });

    revalidatePath("/estornos");
    revalidatePath("/dashboard");
    revalidatePath("/transacoes");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function getAdminRefundRequestsAction(params?: {
  page?: number;
  limit?: number;
  excludeTestUsers?: boolean;
}): Promise<ActionResult<RefundRequestList>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.get(
        API_PATHS.adminWallet.refundRequests,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 50,
            status: "PENDING",
            excludeUserEmailPrefix:
              params?.excludeTestUsers === false
                ? undefined
                : TEST_USER_EMAIL_PREFIX,
          },
        }
      );
      return refundRequestListSchema.parse(response);
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function createRefundRequestAction(
  transactionId: string,
  reason?: string
): Promise<ActionResult<RefundRequest>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.post(
        API_PATHS.wallet.refundRequest(transactionId),
        reason ? { reason } : {}
      );
      return refundRequestSchema.parse(response);
    });

    revalidatePath("/estornos");
    revalidatePath("/dashboard");
    revalidatePath("/transacoes");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function approveRefundRequestAction(
  refundRequestId: string
): Promise<ActionResult<RefundRequest>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.post(
        API_PATHS.adminWallet.approveRefundRequest(refundRequestId)
      );
      return refundRequestSchema.parse(response);
    });

    revalidatePath("/estornos");
    revalidatePath("/dashboard");
    revalidatePath("/transacoes");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function rejectRefundRequestAction(
  refundRequestId: string
): Promise<ActionResult<RefundRequest>> {
  try {
    const data = await serverRequest(async (client) => {
      const { data: response } = await client.post(
        API_PATHS.adminWallet.rejectRefundRequest(refundRequestId)
      );
      return refundRequestSchema.parse(response);
    });

    revalidatePath("/estornos");
    revalidatePath("/dashboard");
    revalidatePath("/transacoes");

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
