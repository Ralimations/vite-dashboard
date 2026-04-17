import * as React from "react"
import { FileText } from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2 px-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Documents</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Team Ral & Tahira</span>
      </div>
    </header>
  )
}
