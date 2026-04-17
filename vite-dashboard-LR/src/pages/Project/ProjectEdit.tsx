import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useProjects, Project } from "@/contexts/ProjectsContext"

export function ProjectEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getProject, fetchProject, updateProject, loading: contextLoading } = useProjects()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    assignee: "",
    status: "",
  })

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      // First try to get from context
      let foundProject = getProject(id)
      
      // If not found in context, fetch from API
      if (!foundProject) {
        foundProject = await fetchProject(id)
      }

      if (foundProject) {
        setProject(foundProject)
        setFormData({
          name: foundProject.name,
          description: foundProject.description,
          priority: foundProject.priority,
          assignee: foundProject.assignee,
          status: foundProject.status,
        })
      }
      setLoading(false)
    }

    loadProject()
  }, [id, getProject, fetchProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      try {
        await updateProject(id, {
          name: formData.name,
          description: formData.description,
          priority: formData.priority,
          assignee: formData.assignee,
          status: formData.status,
        })
        navigate("/projects")
      } catch (error) {
        console.error("Failed to update project:", error)
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Edit Project</CardTitle>
              <CardDescription>Update project details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Enter assignee name"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
