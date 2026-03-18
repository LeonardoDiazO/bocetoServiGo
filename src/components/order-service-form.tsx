"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { clients, equipment, technicians } from "@/lib/data"
import { ServiceClosureModal } from "./service-closure-modal"
import { Wrench } from "lucide-react"

export function OrderServiceForm() {
  const [selectedClient, setSelectedClient] = React.useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = React.useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId)
    setSelectedEquipment([]) // Reset equipment selection when client changes
  }

  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    )
  }

  const availableEquipment = selectedClient
    ? equipment.filter((eq) => eq.clientId === selectedClient)
    : []

  return (
    <>
      <Card className="card-sg w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Nueva Orden de Servicio
          </CardTitle>
          <CardDescription>
            Complete los detalles para crear una nueva orden de servicio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select onValueChange={handleClientChange}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tecnico">Técnico Asignado</Label>
                <Select>
                  <SelectTrigger id="tecnico">
                    <SelectValue placeholder="Seleccione un técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedClient && (
              <div className="space-y-4">
                <Label>Equipos en la Sede del Cliente</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border p-4 max-h-60 overflow-y-auto">
                  {availableEquipment.length > 0 ? (
                    availableEquipment.map((eq) => (
                      <div key={eq.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`eq-${eq.id}`}
                          checked={selectedEquipment.includes(eq.id)}
                          onCheckedChange={() => handleEquipmentChange(eq.id)}
                        />
                        <Label htmlFor={`eq-${eq.id}`} className="font-normal">
                          {eq.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay equipos para este cliente.
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Cierre de Servicio
          </Button>
          <Button>Crear Orden de Servicio</Button>
        </CardFooter>
      </Card>
      <ServiceClosureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
