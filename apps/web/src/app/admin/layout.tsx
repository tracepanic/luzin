import { LayoutClient } from "@/app/admin/layout-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    redirect("/login");
    return;
  }

  if (!session.user.role || session.user.role !== "admin") {
    redirect(`/unauthorized?origin=${encodeURIComponent("/admin/*")}`);
  }

  return <LayoutClient user={session.user}>{children}</LayoutClient>;
}
