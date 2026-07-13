/** Intervalo de polling para saldo/carteira (aba visível). */
export const BALANCE_POLL_MS = 4_000;

/** Intervalo de polling para listas de transações (aba visível). */
export const TRANSACTIONS_POLL_MS = 5_000;

export const balanceQueryOptions = {
  staleTime: 0,
  refetchInterval: BALANCE_POLL_MS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

export const transactionsQueryOptions = {
  staleTime: 0,
  refetchInterval: TRANSACTIONS_POLL_MS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;
