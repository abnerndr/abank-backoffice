import { RefundsTable } from "../../components/estornos/refunds-table";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getAdminTransactionsAction } from "../../lib/actions/wallet";

export default async function EstornosPage() {
  const result = await getAdminTransactionsAction({ page: 1, limit: 50 });

  return (
    <div>
      <PageHeader
        title="Estornos"
        description="Revise transações elegíveis e aprove ou rejeite estornos"
      />

      {!result.ok ? (
        <ErrorBox msg={result.error} />
      ) : (
        <RefundsTable initialData={result.data} />
      )}
    </div>
  );
}
