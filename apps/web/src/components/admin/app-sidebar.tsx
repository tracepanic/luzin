import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSchoolData } from "@/hooks/use-school-data";
import { useSchoolStore } from "@/store/school.store";
import { User } from "better-auth";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

function AppSidebar({ user }: { user: User }) {
  useSchoolData();
  const { isUpdating, school } = useSchoolStore();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {isUpdating || !school ? (
                <Skeleton className="w-full h-12 flex items-center gap-3 p-2">
                  <Skeleton className="h-10 aspect-square"></Skeleton>
                  <div className="h-10 w-full flex flex-col gap-1 mt-1">
                    <Skeleton className="w-full h-5"></Skeleton>
                    <Skeleton className="w-full h-3"></Skeleton>
                  </div>
                </Skeleton>
              ) : (
                <Link href="/admin" className="h-12">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GraduationCap className="size-7" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {school.name}
                    </span>
                    <span className="truncate text-xs">Admin Dashboard</span>
                  </div>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
