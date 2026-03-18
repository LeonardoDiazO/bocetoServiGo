"use client"

import { Card, CardContent } from "@/components/ui/card"
import { KpiDonutChart } from "./kpi-donut-chart"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  metric: string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'default'
  description: string
  compliance?: number
  alert?: boolean
}

const colorMap = {
  blue:    { bg: 'bg-blue-50',   icon: 'text-[#2563EB]',  ring: 'ring-blue-100',   dot: '#2563EB' },
  green:   { bg: 'bg-green-50',  icon: 'text-[#16A34A]',  ring: 'ring-green-100',  dot: '#16A34A' },
  orange:  { bg: 'bg-orange-50', icon: 'text-[#F97316]',  ring: 'ring-orange-100', dot: '#F97316' },
  default: { bg: 'bg-slate-50',  icon: 'text-slate-500',  ring: 'ring-slate-100',  dot: '#64748B' },
}

export function KpiCard({ title, metric, icon, color, description, compliance, alert }: KpiCardProps) {
  const LucideIcon = (Icons as unknown as Record<string, React.ElementType>)[icon]
  const c = colorMap[color] ?? colorMap.default

  return (
    <Card className="card-sg overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Icon pill */}
          <div className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-4', c.bg, c.ring)}>
            {LucideIcon && <LucideIcon className={cn('h-5 w-5', c.icon)} strokeWidth={2} />}
            {/* Pulse indicator for alert state */}
            {alert && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: c.dot }} />
                <span className="relative inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: c.dot }} />
              </span>
            )}
          </div>

          {/* SLA Donut */}
          {compliance !== undefined && (
            <KpiDonutChart percentage={compliance} color={c.dot} strokeWidth={7} size={52} />
          )}
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-0.5 text-4xl font-extrabold tracking-tight text-slate-900">{metric}</p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
