"use client";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { BreadcrumbRenderer } from "@/components/custom/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "better-auth";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function LayoutClient({ children, user }: { children: ReactNode; user: User }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <BreadcrumbRenderer url={pathname} />
          </div>
        </header>
        <Separator />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { LayoutClient };
