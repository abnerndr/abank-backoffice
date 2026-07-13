import { redirect } from "next/navigation";
import { getSessionAction } from "./lib/actions/auth";

export default async function HomePage() {
  const session = await getSessionAction();

  if (session.ok && session.data) {
    redirect("/dashboard");
  }

  redirect("/login");
}
