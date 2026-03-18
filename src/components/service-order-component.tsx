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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { inventory } from "@/lib/data"
import { useSignatureCanvas } from "@/hooks/use-signature-canvas"
import { Wrench } from "lucide-react"

export function ServiceOrderComponent() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { clearSignature, getSignatureDataUrl } = useSignatureCanvas(canvasRef, {
    color: "#2563EB",
  })

  const handleSave = () => {
    const signature = getSignatureDataUrl()
    console.log("Firma Guardada:", signature)
    // Here you would typically save all the data and submit the report
  }

  return (
    <Card className="card-sg w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Cierre de Orden de Servicio
        </CardTitle>
        <CardDescription>
          Registre los hallazgos, repuestos utilizados, tiempo y firma de
          conformidad para cerrar la OS.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
                <Label htmlFor="findings">Hallazgos y Observaciones</Label>
                <Textarea
                id="findings"
                placeholder="Describa el trabajo realizado y las condiciones del equipo."
                rows={4}
                />
            </div>
            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="parts">Repuestos Utilizados</Label>
                    <Select>
                    <SelectTrigger id="parts">
                        <SelectValue placeholder="Seleccione un repuesto" />
                    </SelectTrigger>
                    <SelectContent>
                        {inventory.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name} (Stock: {item.stock})
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="execution-time">Tiempo de ejecución (horas)</Label>
                    <Input id="execution-time" type="number" placeholder="Ej: 2.5" />
                </div>
            </div>
        </div>

        <div className="grid gap-2">
          <Label>Firma del Cliente</Label>
          <div className="relative w-full h-48 rounded-md border bg-background">
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
          className="w-full sm:w-auto"
        >
          Limpiar Firma
        </Button>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Finalizar y Enviar Reporte
        </Button>
      </CardFooter>
    </Card>
  )
}
