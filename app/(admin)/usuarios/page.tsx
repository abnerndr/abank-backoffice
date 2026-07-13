import { Suspense } from "react";
import { UsersTable } from "../../components/users/users-table";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getUsersAction } from "../../lib/actions/users";

interface UsuariosPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function UsuariosPage({ searchParams }: UsuariosPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search ?? "";

  const result = await getUsersAction({ page, limit: 10, search });

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie contas, verificação e acesso"
      />

      {!result.ok ? (
        <ErrorBox msg={result.error} />
      ) : (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Carregando...</div>}>
          <UsersTable initialData={result.data} />
        </Suspense>
      )}
    </div>
  );
}
