export const COOKIE_NAMES = {
  accessToken: "abank_bo_access_token",
  refreshToken: "abank_bo_refresh_token",
} as const;

export const API_PATHS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
  },
  users: {
    list: "/api/users",
    stats: "/api/users/stats",
    byId: (id: string) => `/api/users/${id}`,
    verify: (id: string) => `/api/users/${id}/verify`,
  },
  wallet: {
    me: "/api/wallet/me",
    transfer: "/api/wallet/transfer",
    reverse: (id: string) => `/api/wallet/transactions/${id}/reverse`,
  },
  adminWallet: {
    wallets: "/api/admin/wallet/wallets",
    userWallet: (userId: string) => `/api/admin/wallet/users/${userId}`,
    transactions: "/api/admin/wallet/transactions",
    transaction: (id: string) => `/api/admin/wallet/transactions/${id}`,
  },
} as const;

export const ADMIN_ROUTES = [
  "/dashboard",
  "/usuarios",
  "/saldo",
  "/estornos",
] as const;
