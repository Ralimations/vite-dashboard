import * as React from "react"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    description: "+180.1% from last month",
    icon: Users,
  },
  {
    title: "Sales",
    value: "12,234",
    description: "+19% from last month",
    icon: TrendingUp,
  },
  {
    title: "Active Now",
    value: "573",
    description: "+201 since last hour",
    icon: Activity,
  },
]

export function SectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
