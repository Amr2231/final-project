"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DOCTOR_NAV_GROUPS } from "../../constants/navigation";

export function DoctorNavGroups() {
  const pathname = usePathname();

  return (
    <>
      {DOCTOR_NAV_GROUPS.map((group) => (
        <SidebarGroup key={group.label} className="px-3 py-2">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {group.items.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== "/doctor/dashboard" &&
                  pathname.startsWith(item.url + "/"));
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "bg-blue-800 text-white hover:bg-blue-800 hover:text-white shadow-sm shadow-blue-800/30 font-medium"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent font-normal"
                    }
                  >
                    <Link href={item.url}>
                      <Icon
                        className={`size-4 shrink-0 ${isActive ? "text-white" : "text-sidebar-foreground/50"}`}
                      />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
