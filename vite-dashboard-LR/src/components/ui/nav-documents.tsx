import * as React from "react"
import { FileText, Folder } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const documents = [
  {
    name: "Introduction",
    url: "#",
    icon: FileText,
  },
  {
    name: "Getting Started",
    url: "#",
    icon: FileText,
  },
  {
    name: "Components",
    url: "#",
    icon: Folder,
  },
  {
    name: "API Reference",
    url: "#",
    icon: FileText,
  },
]

export function NavDocuments() {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {documents.map((doc) => (
            <SidebarMenuItem key={doc.name}>
              <SidebarMenuButton asChild tooltip={isMobile ? undefined : doc.name}>
                <a href={doc.url}>
                  <doc.icon />
                  <span>{doc.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
