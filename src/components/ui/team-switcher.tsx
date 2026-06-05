"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    plan: string;
  }[];
}) {
  const { state } = useSidebar();
  const team = teams[0];

  if (!team) return null;

  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu className="px-1 pt-1 pb-2">
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="pointer-events-none select-none hover:bg-transparent active:bg-transparent"
        >
          {/* Logo */}
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-800 text-white font-bold text-sm shrink-0 shadow-sm shadow-blue-800/40">
            E
          </div>

          {!isCollapsed && (
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-bold text-sm text-sidebar-foreground">
                {team.name}
              </span>
              <span className="truncate text-[11px] text-sidebar-foreground/50 font-medium">
                {team.plan}
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
