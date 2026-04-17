import * as React from "react"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Simple chart component - in a real app, you'd use a charting library like recharts
export function ChartAreaInteractive() {
  const data = [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 300 },
    { month: "Mar", value: 500 },
    { month: "Apr", value: 450 },
    { month: "May", value: 600 },
    { month: "Jun", value: 550 },
  ]

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground mt-2">
                {item.month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            +12.5% from last period
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
