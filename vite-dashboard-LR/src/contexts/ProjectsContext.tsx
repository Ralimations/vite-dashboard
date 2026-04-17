import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

export interface Project {
  id: string
  name: string
  description: string
  status: string
  priority: string
  assignee: string
  createdAt: string
  updatedAt: string
}

interface ProjectsContextType {
  projects: Project[]
  loading: boolean
  error: string | null
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProject: (id: string) => Project | undefined
  fetchProject: (id: string) => Promise<Project | null>
  refreshProjects: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

const API_BASE_URL = "https://intercentral-jody-customarily.ngrok-free.dev"

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch projects: ${response.statusText}`)
      }
      
      const data = await response.json()
      // Backend returns: { message: "success", data: [...] }
      const projectsData = data.data || []
      // Normalize field names: created_at -> createdAt, last_updated -> updatedAt
      // Convert ID to string for consistency
      const normalizedProjects = projectsData.map((project: any) => ({
        id: String(project.id),
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'Active',
        priority: project.priority || 'Medium',
        assignee: project.assignee || 'Unassigned',
        createdAt: project.created_at || project.createdAt || '',
        updatedAt: project.last_updated || project.updatedAt || '',
      }))
      setProjects(normalizedProjects)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects"
      setError(errorMessage)
      console.error("Error fetching projects:", err)
      setProjects([]) // Set empty array on error
      toast.error("Failed to load projects", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const addProject = async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)
      // Backend expects: name, description, status, assignee, priority
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description || '',
          status: projectData.status || 'Active',
          assignee: projectData.assignee || 'Unassigned',
          priority: projectData.priority || 'Medium',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create project: ${response.statusText}`)
      }

      // Refresh projects list after creation
      await fetchProjects()
      toast.success("Project created successfully", {
        description: `${projectData.name} has been added to your projects.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create project"
      setError(errorMessage)
      console.error("Error creating project:", err)
      toast.error("Failed to create project", {
        description: errorMessage,
      })
      throw err
    }
  }

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      setError(null)
      // Backend uses PATCH, not PUT
      // Backend expects: name, description, status, assignee, priority
      // Map frontend fields to backend fields
      const updatePayload: any = {}
      if (projectData.name !== undefined) updatePayload.name = projectData.name
      if (projectData.description !== undefined) updatePayload.description = projectData.description
      if (projectData.status !== undefined) updatePayload.status = projectData.status
      if (projectData.assignee !== undefined) updatePayload.assignee = projectData.assignee
      if (projectData.priority !== undefined) updatePayload.priority = projectData.priority

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update project: ${response.statusText}`)
      }

      // Refresh projects list after update
      await fetchProjects()
      toast.success("Project updated successfully", {
        description: "The project has been updated.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update project"
      setError(errorMessage)
      console.error("Error updating project:", err)
      toast.error("Failed to update project", {
        description: errorMessage,
      })
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to delete project: ${response.statusText}`)
      }

      // Refresh projects list after deletion
      await fetchProjects()
      toast.success("Project deleted successfully", {
        description: "The project has been removed.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete project"
      setError(errorMessage)
      console.error("Error deleting project:", err)
      toast.error("Failed to delete project", {
        description: errorMessage,
      })
      throw err
    }
  }

  const getProject = (id: string) => {
    return projects.find((project) => 
      project.id === id || 
      project.id === String(id) ||
      String(project.id) === String(id)
    )
  }

  // Fetch a single project from API
  const fetchProject = async (id: string): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
      
      if (!response.ok) {
        return null
      }
      
      const data = await response.json()
      // Backend returns: { message: "success", data: {...} }
      const projectData = data.data
      if (!projectData) {
        return null
      }

      // Normalize field names: created_at -> createdAt, last_updated -> updatedAt
      return {
        id: String(projectData.id),
        name: projectData.name || '',
        description: projectData.description || '',
        status: projectData.status || 'Active',
        priority: projectData.priority || 'Medium',
        assignee: projectData.assignee || 'Unassigned',
        createdAt: projectData.created_at || projectData.createdAt || '',
        updatedAt: projectData.last_updated || projectData.updatedAt || '',
      }
    } catch (err) {
      console.error("Error fetching project:", err)
      return null
    }
  }

  const refreshProjects = async () => {
    await fetchProjects()
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        fetchProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
