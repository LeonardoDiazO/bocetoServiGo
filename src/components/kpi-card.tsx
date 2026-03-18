"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KpiDonutChart } from "./kpi-donut-chart"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  metric: string
  icon: keyof typeof Icons
  color: 'magenta' | 'cyan' | 'default'
  description: string
  compliance?: number
}

const colorClasses = {
    magenta: "text-primary-magenta",
    cyan: "text-primary-cyan",
    default: "text-muted-foreground"
}

const chartColors = {
    magenta: "hsl(var(--primary-magenta))",
    cyan: "hsl(var(--primary-cyan))",
    default: "hsl(var(--foreground))"
}

export function KpiCard({
  title,
  metric,
  icon,
  color,
  description,
  compliance,
}: KpiCardProps) {
    const LucideIcon = Icons[icon] as React.ElementType;

  return (
    <Card className="card-sg">
      <CardHeader className="p-6 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="card-title-text">{title}</CardTitle>
            {LucideIcon && <LucideIcon className={cn("h-4 w-4", colorClasses[color])} />}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex flex-col justify-end min-h-[90px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kpi-metric">{metric}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="shrink-0">
            {compliance !== undefined && (
              <KpiDonutChart 
                percentage={compliance} 
                color={chartColors[color]}
                strokeWidth={12}
                size={60}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
