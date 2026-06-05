import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { DoctorNavGroups } from "./shared/doctor-nav-groups";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession(authOptions);
  const data = {
    user: {
      name: session?.user.name ?? "Dr. Ahmed",
      email: session?.user.email ?? "doctor@email.com",
      avatar: "",
    },
    teams: [
      {
        name: "Echo vision",
        logo: <GalleryVerticalEndIcon />,
        plan: "Doctor Portal",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <DoctorNavGroups />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
