"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Moon, Shield, Sun, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "../../lib/actions/auth";
import { loginSchema, type LoginInput } from "../../lib/schemas/auth";
import { useUiStore } from "../../lib/store/ui-store";
import { Field, inputClassName, buttonPrimaryClassName } from "../shared";

export function LoginForm() {
  const router = useRouter();
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setIsPending(true);

    const result = await loginAction(data);

    if (!result.ok) {
      setServerError(result.error);
      setIsPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr]">
      <div
        className="hidden md:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "var(--primary)" }}
      >
        <div
          className="absolute"
          style={{
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
            bottom: -160,
            right: -160,
          }}
        />
        <div
          className="absolute"
          style={{
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
            bottom: -80,
            right: -80,
          }}
        />
        <div
          className="absolute top-0 left-14 right-14 h-px"
          style={{ background: "var(--accent)", opacity: 0.3 }}
        />

        <div className="relative flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1px solid rgba(201,169,110,0.4)" }}
          >
            <Shield size={16} style={{ color: "var(--accent)" }} />
          </div>
          <span
            className="text-sm tracking-[0.22em] uppercase font-medium"
            style={{ color: "var(--primary-foreground)", opacity: 0.55 }}
          >
            ABank
          </span>
        </div>

        <div className="relative">
          <div
            className="text-xs tracking-[0.2em] uppercase mb-6"
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            Backoffice
          </div>

          <h2
            className="text-4xl font-bold leading-snug mb-6"
            style={{
              color: "var(--primary-foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            Gestão administrativa
            <br />
            <span style={{ color: "var(--accent)" }}>com controle total.</span>
          </h2>

          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "var(--primary-foreground)", opacity: 0.5 }}
          >
            Gerencie usuários, saldos e estornos com segurança e transparência.
          </p>
        </div>

        <div
          className="relative text-xs"
          style={{
            color: "var(--primary-foreground)",
            opacity: 0.3,
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          admin@example.com / admin123
        </div>
      </div>

      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between px-8 pt-8 pb-0">
          <div className="flex items-center gap-2 md:hidden">
            <Shield size={16} className="text-foreground" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              ABank Backoffice
            </span>
          </div>
          <div className="hidden md:block" />
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Alternar tema"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xs">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight mb-1.5">
                Acesso administrativo
              </h1>
              <p className="text-sm text-muted-foreground">
                Entre com suas credenciais de administrador
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Field label="E-mail">
                <input
                  type="email"
                  placeholder="admin@example.com"
                  {...form.register("email")}
                  className={inputClassName()}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field label="Senha">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className={inputClassName()}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              {serverError && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-md px-3 py-2 text-xs">
                  <XCircle size={13} className="shrink-0" />
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className={`w-full mt-1 ${buttonPrimaryClassName()}`}
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
