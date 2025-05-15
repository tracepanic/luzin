import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/lib/types";
import {
  Calendar,
  CalendarClock,
  ChevronRight,
  House,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: House,
  },
  {
    title: "Academic Years",
    url: "/admin/academic-years",
    icon: CalendarClock,
    items: [
      { title: "All Academic Years", url: "/admin/academic-years/all" },
      { title: "New Academic Year", url: "/admin/academic-years/new" },
    ],
  },
  {
    title: "Invites",
    url: "/admin/invites",
    icon: UserPlus,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
    items: [{ title: "New Event", url: "/admin/calendar/events/new" }],
  },
];

function NavMain() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {ITEMS.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          onClick={() => setOpenMobile(false)}
                        >
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavMain };
