"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { transferBalanceAction } from "../../lib/actions/wallet";
import {
  transferSchema,
  type TransferInput,
  type Wallet,
} from "../../lib/schemas/wallet";
import { formatCurrency } from "../../lib/utils/format";
import {
  Card,
  Field,
  inputClassName,
  buttonPrimaryClassName,
} from "../shared";

export function AddBalanceForm({
  adminWallet,
  defaultEmail = "",
}: {
  adminWallet: Wallet;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: { toEmail: defaultEmail, amount: "" },
  });

  async function onSubmit(data: TransferInput) {
    setIsPending(true);
    const result = await transferBalanceAction(data);

    if (!result.ok) {
      toast.error(result.error);
      setIsPending(false);
      return;
    }

    toast.success(
      `Transferência de ${formatCurrency(data.amount)} realizada com sucesso.`
    );
    form.reset({ toEmail: data.toEmail, amount: "" });
    router.refresh();
    setIsPending(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Carteira admin
        </h2>
        <div
          className="text-3xl font-bold text-accent"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {formatCurrency(adminWallet.balance, adminWallet.currency)}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Saldo disponível para transferências
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Transferir saldo
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <Field label="E-mail do destinatário">
            <input
              type="email"
              placeholder="usuario@email.com"
              {...form.register("toEmail")}
              className={inputClassName()}
            />
            {form.formState.errors.toEmail && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.toEmail.message}
              </p>
            )}
          </Field>

          <Field label="Valor (R$)">
            <input
              type="text"
              placeholder="100.00"
              {...form.register("amount")}
              className={inputClassName()}
            />
            {form.formState.errors.amount && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </Field>

          <button
            type="submit"
            disabled={isPending}
            className={buttonPrimaryClassName()}
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Transferir saldo
          </button>
        </form>
      </Card>
    </div>
  );
}
