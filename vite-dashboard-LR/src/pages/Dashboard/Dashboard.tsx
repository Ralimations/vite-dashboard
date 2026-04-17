import { SectionCards } from "@/components/ui/section-cards"
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive"
import { DataTable } from "@/components/ui/data-table"
import { useProjects } from "@/contexts/ProjectsContext"

export function Dashboard() {
  const { projects } = useProjects()
  // Show the 5 most recent projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <SectionCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ChartAreaInteractive />
        <DataTable data={recentProjects} />
      </div>
    </div>
  )
}
