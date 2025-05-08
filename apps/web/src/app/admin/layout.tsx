"use client";

import { Loader } from "@/components/custom/loader";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    toast.error("Login to access this page");
    router.push("/login");
  }

  if (!data) {
    toast.error("Login to access this page");
    router.push("/login");
    return;
  }

  if (!data.user.role || data.user.role !== "admin") {
    toast.error("You don't have permissions to acess this page");
    router.push(`/unauthorized?origin=${encodeURIComponent("/admin/*")}`);
  }

  return <div>{children}</div>;
}
