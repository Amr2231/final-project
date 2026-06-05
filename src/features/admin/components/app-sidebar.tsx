import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { AdminNavGroups } from "./shared/admin-nav-groups";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Echo vision",
              plan: "Hospital Admin",
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavGroups />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user.name ?? "Admin",
            email: session?.user.email ?? "admin@email.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
