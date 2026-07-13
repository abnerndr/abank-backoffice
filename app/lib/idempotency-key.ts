/** Uma key por tentativa de operação — reutilizada em retries, nova a cada mount do form. */
export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}
