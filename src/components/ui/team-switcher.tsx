"use client";

import * as React from "react";
import logo from "../../../public/logo.jpeg";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

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
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden border border-sidebar-border">
            <Image
              src={logo}
              alt="logo"
              className="w-full h-full object-cover"
            />
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
