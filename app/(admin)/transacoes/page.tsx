import { Suspense } from "react";
import { TransactionsTable } from "../../components/transacoes/transactions-table";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getAdminTransactionsAction } from "../../lib/actions/wallet";

interface TransacoesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TransacoesPage({
  searchParams,
}: TransacoesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAdminTransactionsAction({ page, limit: 20 });

  return (
    <div>
      <PageHeader
        title="Transações"
        description="Histórico completo de depósitos, transferências e estornos"
      />

      {!result.ok ? (
        <ErrorBox msg={result.error} />
      ) : (
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">Carregando...</div>
          }
        >
          <TransactionsTable initialData={result.data} />
        </Suspense>
      )}
    </div>
  );
}
