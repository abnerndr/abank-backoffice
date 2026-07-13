export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type PaginatedQuery = {
  page?: number;
  limit?: number;
  search?: string;
};
