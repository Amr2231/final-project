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
import { ReceptionNavGroups } from "./reception-nav-groups";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Echo vision",
              plan: "Hospital",
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <ReceptionNavGroups />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name ?? "User",
            email: session?.user?.email ?? "Email",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
