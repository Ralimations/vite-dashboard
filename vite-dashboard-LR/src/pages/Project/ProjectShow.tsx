import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useProjects, Project } from "@/contexts/ProjectsContext"

export function ProjectShow() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getProject, fetchProject, deleteProject, loading: contextLoading } = useProjects()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      // First try to get from context
      let foundProject: Project | null = getProject(id) || null
      
      // If not found in context, fetch from API
      if (!foundProject) {
        console.log("Project not found in context, fetching from API for ID:", id)
        foundProject = await fetchProject(id)
      } else {
        console.log("Project found in context:", foundProject)
      }

      if (!foundProject) {
        console.log("Project not found in API either for ID:", id)
      }

      setProject(foundProject)
      setLoading(false)
    }

    loadProject()
  }, [id, getProject, fetchProject])

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteProject(id)
        navigate("/projects")
      } catch (error) {
        console.error("Failed to delete project:", error)
        // You could add a toast notification here
      }
    }
  }

  if (loading || contextLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading project...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist. ID: {id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>Project Details</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to={`/projects/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project
                      "{project.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <Badge variant="default">{project.status}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <p className="text-sm">{project.priority}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Assignee</h3>
              <p className="text-sm">{project.assignee}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Created At</h3>
              <p className="text-sm text-muted-foreground">{project.createdAt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{project.updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
