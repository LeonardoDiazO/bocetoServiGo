"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inventory } from "@/lib/data"
import { useSignatureCanvas } from "@/hooks/use-signature-canvas"

interface ServiceClosureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServiceClosureModal({
  isOpen,
  onClose,
}: ServiceClosureModalProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { clearSignature, getSignatureDataUrl } = useSignatureCanvas(canvasRef)

  const handleSave = () => {
    const signature = getSignatureDataUrl()
    console.log("Firma Guardada:", signature)
    // Here you would typically save all the data
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cierre de Servicio</DialogTitle>
          <DialogDescription>
            Registre los hallazgos, repuestos utilizados y la firma de
            conformidad.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="findings">Hallazgos y Observaciones</Label>
            <Textarea
              id="findings"
              placeholder="Describa el trabajo realizado y las condiciones del equipo."
              rows={4}
            />
          </div>
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
            <Label>Firma del Cliente</Label>
            <div className="relative w-full h-48 rounded-md border bg-background">
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={clearSignature}
              className="w-full sm:w-auto"
            >
              Limpiar Firma
            </Button>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full sm:w-auto">
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" onClick={handleSave} className="w-full sm:w-auto">
                    Guardar Cierre
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
