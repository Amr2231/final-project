import { StaffRealtimeBridge } from "@/components/realtime/staff-realtime-bridge";
import { AppSidebar } from "@/features/admin";
import { NotificationBell } from "@/features/notifications";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { HeaderUser } from "@/components/ui/header-user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/types/admin";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "Admin") redirect("/unauthorized");

  return (
    <SidebarProvider>
      <StaffRealtimeBridge scope="admin" />
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 px-4 bg-background/80 backdrop-blur-sm border-b border-border/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-border/60" />
            <DynamicBreadcrumb />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationBell role={(session?.role as Role) ?? "Admin"} />
            <div className="h-4 w-px bg-border/60 mx-1" />
            <HeaderUser
              name={session?.user.name ?? "User"}
              email={session?.user.email ?? ""}
              role={session?.role}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
