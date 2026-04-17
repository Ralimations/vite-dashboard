import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { Toaster } from "@/components/ui/sonner"
import { ProjectsProvider } from "@/contexts/ProjectsContext"
import { Dashboard } from "@/pages/Dashboard/Dashboard"
import { ProjectList } from "@/pages/Project/ProjectList"
import { ProjectCreate } from "@/pages/Project/ProjectCreate"
import { ProjectEdit } from "@/pages/Project/ProjectEdit"
import { ProjectShow } from "@/pages/Project/ProjectShow"

function App() {
  return (
    <BrowserRouter>
      <ProjectsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/create" element={<ProjectCreate />} />
              <Route path="/projects/:id" element={<ProjectShow />} />
              <Route path="/projects/:id/edit" element={<ProjectEdit />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </ProjectsProvider>
    </BrowserRouter>
  )
}

export default App
