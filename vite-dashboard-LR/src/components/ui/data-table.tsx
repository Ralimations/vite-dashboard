import * as React from "react"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DataTableProps {
  data?: Array<{
    id: string
    name: string
    status: string
    priority: string
    assignee: string
  }>
}

const defaultData = [
  { id: "1", name: "Project Alpha", status: "Active", priority: "High", assignee: "John Doe" },
  { id: "2", name: "Project Beta", status: "Pending", priority: "Medium", assignee: "Jane Smith" },
  { id: "3", name: "Project Gamma", status: "Completed", priority: "Low", assignee: "Bob Johnson" },
  { id: "4", name: "Project Delta", status: "Active", priority: "High", assignee: "Alice Brown" },
]

export function DataTable({ data = defaultData }: DataTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Active: "default",
      Pending: "secondary",
      Completed: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>A list of your recent projects and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <Link to={`/projects/${row.id}`} className="hover:underline">
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>{getStatusBadge(row.status)}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
