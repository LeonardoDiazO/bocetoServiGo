"use client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { serviceOrders } from "@/lib/data"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { List } from "lucide-react"

export function RecentSales() {
    const recentCompletedOrders = serviceOrders
        .filter(order => order.status === 'Completado')
        .slice(0, 5);

  return (
    <Card className="card-sg h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5"/>
                Actividad Reciente
            </CardTitle>
            <CardDescription>
                Últimas 5 órdenes de servicio completadas.
            </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="space-y-6">
                {recentCompletedOrders.map(order => (
                    <div className="flex items-center" key={order.id}>
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{order.technicianName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{order.clientName}</p>
                            <p className="text-sm text-muted-foreground">{order.technicianName}</p>
                        </div>
                        <div className="ml-auto font-medium">+${order.value?.toFixed(2)}</div>
                    </div>
                ))}
             </div>
        </CardContent>
    </Card>
  )
}
