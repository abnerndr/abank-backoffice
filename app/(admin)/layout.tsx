import { redirect } from "next/navigation";
import { AdminShell } from "../../components/shell/admin-shell";
import { getSessionAction } from "../../lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionAction();

  if (!session.ok || !session.data) {
    redirect("/login");
  }

  return <AdminShell user={session.data}>{children}</AdminShell>;
}
