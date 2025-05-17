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
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function LayoutClient({ children, user }: { children: ReactNode; user: User }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex justify-between h-12 shrink-0 items-center gap-2 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <BreadcrumbRenderer url={pathname} />
          </div>
          <div>
            <div className="relative">
              <Bell className="size-5 text-muted-foreground" />
              <div className="absolute top-0 right-0 h-1.5 w-1.5 bg-primary animate-ping rounded-full"></div>
            </div>
          </div>
        </header>
        <Separator />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { LayoutClient };
