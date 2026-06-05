"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-3 py-2">
      <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={
                  isActive
                    ? "bg-blue-800 text-white hover:bg-blue-900 hover:text-white shadow-sm shadow-[#8B1A2B]/30 font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent font-normal"
                }
              >
                <Link href={item.url}>
                  <span
                    className={`flex items-center justify-center size-4 shrink-0 ${isActive ? "text-white" : "text-sidebar-foreground/50"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
