import * as React from "react"
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  ArrowRight,
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"

export function NavMain() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

  const isQuickCreateActive = location.pathname === "/projects/create"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isQuickCreateActive}
          tooltip={isMobile ? undefined : "Quick Create"}
          onClick={() => navigate("/projects/create")}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Quick Create</span>
          </div>
          <ArrowRight className="h-4 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={location.pathname === "/"}
          tooltip={isMobile ? undefined : "Dashboard"}
        >
          <Link to="/">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={location.pathname === "/projects" || (location.pathname.startsWith("/projects/") && location.pathname !== "/projects/create")}
          tooltip={isMobile ? undefined : "Projects"}
        >
          <Link to="/projects">
            <FolderKanban />
            <span>Projects</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
