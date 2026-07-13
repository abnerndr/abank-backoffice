"use client";

import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  LogOut,
  Moon,
  Shield,
  Sun,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "../../lib/actions/auth";
import type { UserProfile } from "../../lib/schemas/auth";
import { useUiStore } from "../../lib/store/ui-store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/usuarios", label: "Usuários", icon: Users },
  { href: "/transacoes", label: "Transações", icon: History },
  { href: "/saldo", label: "Adicionar Saldo", icon: Wallet },
  { href: "/estornos", label: "Estornos", icon: ArrowLeftRight },
] as const;

export function AdminShell({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  async function handleLogout() {
    await logoutAction();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className="hidden lg:flex w-64 flex-col border-r border-border"
        style={{ background: "var(--primary)" }}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ border: "1px solid rgba(201,169,110,0.4)" }}
            >
              <Shield size={16} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <div
                className="text-xs tracking-[0.18em] uppercase font-medium"
                style={{ color: "var(--primary-foreground)", opacity: 0.55 }}
              >
                ABank
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--primary-foreground)" }}
              >
                Backoffice
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  background: active ? "rgba(201,169,110,0.15)" : "transparent",
                  color: active
                    ? "var(--accent)"
                    : "var(--primary-foreground)",
                  opacity: active ? 1 : 0.65,
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div
            className="text-xs mb-3 truncate"
            style={{
              color: "var(--primary-foreground)",
              opacity: 0.5,
            }}
          >
            {user.name ?? user.email}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-white/5"
            style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-accent" />
            <span className="text-sm font-semibold">Backoffice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        <nav className="lg:hidden flex gap-1 px-2 py-2 border-b border-border overflow-x-auto bg-card">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
