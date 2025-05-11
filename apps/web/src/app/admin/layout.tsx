import { LayoutClient } from "@/app/admin/layout-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";

export default async function Layout({ children }: { children: ReactNode }) {
  const [session] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!session || !session.user) {
    toast.error("Login to access this page");
    redirect("/login");
    return;
  }

  if (!session.user.role || session.user.role !== "admin") {
    toast.error("You don't have permissions to acess this page");
    redirect(`/unauthorized?origin=${encodeURIComponent("/admin/*")}`);
  }

  return <LayoutClient user={session.user}>{children}</LayoutClient>;
}
