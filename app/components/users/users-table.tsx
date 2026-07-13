"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";
import type { UserList } from "../../lib/schemas/users";
import { formatDateShort } from "../../lib/utils/format";
import {
  Badge,
  Card,
  EmptyState,
  inputClassName,
  buttonSecondaryClassName,
} from "../shared";
import { VerifyUserButton } from "./verify-user-button";

export function UsersTable({ initialData }: { initialData: UserList }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`/usuarios?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("page", "1");
    router.push(`/usuarios?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClassName()} pl-9`}
          />
        </div>
        <button type="submit" className={buttonSecondaryClassName()}>
          Buscar
        </button>
      </form>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Usuário
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Cadastro
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {initialData.data.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState message="Nenhum usuário encontrado." />
                  </td>
                </tr>
              ) : (
                initialData.data.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/usuarios/${user.id}`}
                        className="block hover:underline"
                      >
                        <div className="font-medium">
                          {user.name ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={user.isVerified ? "success" : "warning"}>
                        {user.isVerified ? "Verificado" : "Pendente"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {formatDateShort(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <VerifyUserButton
                        userId={user.id}
                        isVerified={user.isVerified}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {initialData.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {initialData.total} usuário(s) · Página {initialData.page} de{" "}
              {initialData.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={initialData.page <= 1}
                onClick={() => goToPage(initialData.page - 1)}
                className={buttonSecondaryClassName()}
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={initialData.page >= initialData.totalPages}
                onClick={() => goToPage(initialData.page + 1)}
                className={buttonSecondaryClassName()}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
