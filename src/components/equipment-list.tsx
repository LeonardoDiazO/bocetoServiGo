"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { equipment, clients, type IEquipment } from "@/lib/data"
import { Building, Search, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EnrichedEquipment extends IEquipment {
  clientName: string
}

const enrichedEquipment: EnrichedEquipment[] = equipment.map((eq) => {
  const client = clients.find((c) => c.id === eq.clientId)
  return {
    ...eq,
    clientName: client ? client.name : "Cliente Desconocido",
  }
})

export function EquipmentListComponent() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredEquipment = React.useMemo(() => {
    if (!searchTerm) {
      return enrichedEquipment
    }
    return enrichedEquipment.filter(
      (eq) =>
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const getStatusBorderClass = (status: "ok" | "critico") => {
    if (status === "critico") {
      return "border-l-4 border-accent"
    }
    return "border-l-4 border-success"
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="card-sg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por equipo, cliente o sede..."
            className="w-full pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {filteredEquipment.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <Card
              key={eq.id}
              className={cn(
                "card-sg transition-all flex flex-col",
                getStatusBorderClass(eq.status)
              )}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-bold pr-2">
                    {eq.name}
                  </CardTitle>
                  <Badge
                    className={cn(
                      "capitalize shrink-0 border-transparent",
                      {
                        "bg-accent text-accent-foreground":
                          eq.status === "critico",
                        "bg-success text-success-foreground": eq.status === "ok",
                      }
                    )}
                  >
                    {eq.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{eq.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>{eq.location}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                {eq.status === "critico" ? (
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="sm"
                  >
                    Crear OS Urgente
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Detalles
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-sg flex h-48 items-center justify-center">
          <p className="text-muted-foreground">
            No se encontraron equipos con ese criterio.
          </p>
        </Card>
      )}
    </div>
  )
}
