"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { IServiceOrder, ServiceOrderStatus } from "@/lib/data"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Clock, MapPin, HardHat } from "lucide-react"

const healthColorMap = {
  Crítico: "bg-destructive", // Red
  Preventivo: "bg-warning", // Yellow
  OK: "bg-success", // Green
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function TechServiceOrderCard({ order }: { order: IServiceOrder }) {
  const [status, setStatus] = useState<ServiceOrderStatus>(order.status)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === "En Proceso") {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleStartService = () => {
    setStatus("En Proceso")
    setElapsedTime(0)
  }

  const handleEndService = () => {
    setStatus("Completado")
  }

  return (
    <Card className="sg-card w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-2xl font-bold">{order.time}</CardTitle>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-semibold uppercase",
              healthColorMap[order.equipmentHealth]
                .replace("bg-", "text-")
                .replace("destructive", "destructive")
            )}
          >
            {order.equipmentHealth}
          </span>
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              healthColorMap[order.equipmentHealth]
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">CLIENTE</p>
          <p className="font-bold">{order.clientName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">EQUIPO</p>
          <p>{order.equipmentName}</p>
        </div>
        <div className="flex items-center gap-2">
           <MapPin className="h-4 w-4 text-muted-foreground" />
           <p className="text-sm text-muted-foreground">{order.address}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`} target="_blank">
                <MapPin className="mr-2 h-4 w-4" />
                Ver en Mapa
            </Link>
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {status === "Pendiente" && (
          <Button
            onClick={handleStartService}
            className="w-full btn-gradient text-white font-semibold"
            size="lg"
          >
            <HardHat className="mr-2" />
            Iniciar Servicio
          </Button>
        )}
        {status === "En Proceso" && (
          <div className="w-full text-center p-4 rounded-lg bg-primary/10">
            <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="h-5 w-5 animate-spin" style={{ animationDuration: '2s' }} />
                <p className="text-xl font-bold font-mono tabular-nums tracking-wider">
                    {formatTime(elapsedTime)}
                </p>
            </div>
            <p className="text-xs text-primary/80 mt-1">Servicio en progreso...</p>
          </div>
        )}
        {status === "En Proceso" && (
             <Button
                onClick={handleEndService}
                className="w-full"
                variant="destructive"
            >
                Finalizar Servicio
            </Button>
        )}
        {status === "Completado" && (
          <div className="w-full text-center p-4 rounded-lg bg-success/10 text-success-foreground">
            <p className="font-semibold">Servicio Completado</p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
