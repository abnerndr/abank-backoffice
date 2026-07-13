import { RefundsTable } from "../../components/estornos/refunds-table";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getAdminRefundRequestsAction } from "../../lib/actions/wallet";

export default async function EstornosPage() {
  const result = await getAdminRefundRequestsAction({ page: 1, limit: 50 });

  return (
    <div>
      <PageHeader
        title="Estornos"
        description="Revise solicitações de estorno e aprove ou rejeite"
      />

      {!result.ok ? (
        <ErrorBox msg={result.error} />
      ) : (
        <RefundsTable initialData={result.data} />
      )}
    </div>
  );
}
