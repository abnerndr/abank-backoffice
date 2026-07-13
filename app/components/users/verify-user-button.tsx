"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { verifyUserAction } from "../../lib/actions/users";

export function VerifyUserButton({
  userId,
  isVerified,
}: {
  userId: string;
  isVerified: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle size={13} />
        Verificado
      </span>
    );
  }

  async function handleVerify() {
    setIsPending(true);
    const result = await verifyUserAction(userId);

    if (!result.ok) {
      toast.error(result.error);
      setIsPending(false);
      return;
    }

    toast.success("Usuário verificado com sucesso.");
    router.refresh();
    setIsPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleVerify}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-accent/40 text-accent hover:bg-accent/10 disabled:opacity-60"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : null}
      Verificar
    </button>
  );
}
