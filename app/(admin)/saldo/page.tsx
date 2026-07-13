import { AddBalanceForm } from "../../components/saldo/add-balance-form";
import { ErrorBox, PageHeader } from "../../components/shared";
import { getAdminWalletAction } from "../../lib/actions/wallet";

interface SaldoPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function SaldoPage({ searchParams }: SaldoPageProps) {
  const params = await searchParams;
  const defaultEmail = params.email ?? "";

  const walletResult = await getAdminWalletAction();

  return (
    <div>
      <PageHeader
        title="Adicionar Saldo"
        description="Credite saldo na carteira de um usuário via transferência da carteira admin"
      />

      {!walletResult.ok ? (
        <ErrorBox msg={walletResult.error} />
      ) : (
        <AddBalanceForm
          adminWallet={walletResult.data}
          defaultEmail={defaultEmail}
        />
      )}
    </div>
  );
}
