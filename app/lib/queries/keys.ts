export const queryKeys = {
  adminWallet: ["admin", "wallet"] as const,
  userWallet: (userId: string) => ["admin", "user-wallet", userId] as const,
  adminTransactions: (page: number, limit: number) =>
    ["admin", "transactions", page, limit] as const,
  adminTransactionStats: ["admin", "transaction-stats"] as const,
  adminRefundRequests: (page: number, limit: number) =>
    ["admin", "refund-requests", page, limit] as const,
  userStats: ["admin", "user-stats"] as const,
  adminWallets: (page: number, limit: number) =>
    ["admin", "wallets", page, limit] as const,
};
