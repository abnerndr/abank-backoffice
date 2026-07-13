import { z } from "zod";

export const transactionTypeSchema = z.enum(["DEPOSIT", "TRANSFER", "REVERSAL"]);
export const transactionStatusSchema = z.enum(["COMPLETED", "REVERSED"]);

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
  idempotencyKey: z.string().nullable(),
  createdAt: z.string().or(z.date()),
});

export const transactionListSchema = z.object({
  transactions: z.array(transactionSchema),
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
});

export type Wallet = z.infer<typeof walletSchema>;
export type AdminWallet = z.infer<typeof adminWalletSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionList = z.infer<typeof transactionListSchema>;
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
