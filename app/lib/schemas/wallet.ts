import { z } from "zod";

export const transactionTypeSchema = z.enum(["DEPOSIT", "TRANSFER", "REVERSAL"]);
export const transactionStatusSchema = z.enum(["COMPLETED", "REVERSED"]);
export const refundRequestStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const walletSchema = z.object({
  id: z.string(),
  balance: z.string(),
  currency: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const adminWalletSchema = walletSchema.extend({
  userId: z.string(),
  userEmail: z.string(),
  userName: z.string().nullable(),
});

export const transactionSchema = z.object({
  id: z.string(),
  type: transactionTypeSchema,
  status: transactionStatusSchema,
  amount: z.string(),
  fromWalletId: z.string().nullable(),
  toWalletId: z.string().nullable(),
  reversalOfId: z.string().nullable(),
  requestedByUserId: z.string(),
  requestedByUserEmail: z.string().nullable().optional(),
  pendingRefundRequestId: z.string().nullable().optional(),
  idempotencyKey: z.string().nullable(),
  createdAt: z.string().or(z.date()),
});

export const transactionListSchema = z.object({
  transactions: z.array(transactionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const transactionStatsSchema = z.object({
  pendingRefunds: z.number(),
  total: z.number(),
});

export const refundRequestSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  status: refundRequestStatusSchema,
  requestedByUserId: z.string(),
  requestedByUserEmail: z.string().nullable().optional(),
  reason: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  resolvedAt: z.string().or(z.date()).nullable(),
  resolvedByUserId: z.string().nullable(),
  transaction: transactionSchema.extend({
    requestedByUserEmail: z.string().nullable().optional(),
    pendingRefundRequestId: z.string().nullable().optional(),
  }),
});

export const refundRequestListSchema = z.object({
  refundRequests: z.array(refundRequestSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const adminWalletListSchema = z.object({
  wallets: z.array(adminWalletSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const transferSchema = z.object({
  toEmail: z.string().email("Informe um e-mail válido."),
  amount: z
    .string()
    .min(1, "Informe o valor.")
    .regex(/^\d+(\.\d{1,4})?$/, "Valor inválido. Use formato 0.00"),
  idempotencyKey: z.string().min(1).max(255),
});

export type Wallet = z.infer<typeof walletSchema>;
export type AdminWallet = z.infer<typeof adminWalletSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionList = z.infer<typeof transactionListSchema>;
export type TransactionStats = z.infer<typeof transactionStatsSchema>;
export type RefundRequest = z.infer<typeof refundRequestSchema>;
export type RefundRequestList = z.infer<typeof refundRequestListSchema>;
export type TransferInput = z.infer<typeof transferSchema>;

export function isReversible(transaction: Transaction): boolean {
  return (
    transaction.status === "COMPLETED" &&
    (transaction.type === "DEPOSIT" || transaction.type === "TRANSFER")
  );
}

export const TRANSACTION_TYPE_LABELS: Record<
  z.infer<typeof transactionTypeSchema>,
  string
> = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferência",
  REVERSAL: "Estorno",
};

export const TRANSACTION_STATUS_LABELS: Record<
  z.infer<typeof transactionStatusSchema>,
  string
> = {
  COMPLETED: "Concluída",
  REVERSED: "Estornada",
};

export const REFUND_REQUEST_STATUS_LABELS: Record<
  z.infer<typeof refundRequestStatusSchema>,
  string
> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};
