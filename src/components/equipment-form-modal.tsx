"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IEquipment, IClient } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EquipmentFormModalProps {
  equipment: IEquipment | null
  isOpen: boolean
  onClose: () => void
  onSave: (equipment: IEquipment) => void
  clients: IClient[]
}

const equipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  location: z.string().min(3, "La ubicación es requerida."),
  clientId: z.string({ required_error: "Debe seleccionar un cliente." }).min(1, "Debe seleccionar un cliente."),
  status: z.enum(["ok", "critico"]),
})

const defaultValues: Omit<IEquipment, 'id'> = {
  name: "",
  location: "",
  clientId: "",
  status: "ok",
}

export function EquipmentFormModal({ equipment, isOpen, onClose, onSave, clients }: EquipmentFormModalProps) {
  const { toast } = useToast()
  
  const form = useForm<IEquipment>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment || { ...defaultValues, id: "" },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset(equipment || { ...defaultValues, id: "" })
    }
  }, [equipment, isOpen, form])

  const onSubmit = (data: IEquipment) => {
    const equipmentToSave = {
      ...data,
      id: equipment?.id || `eq-${Date.now()}`,
    };
    onSave(equipmentToSave)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] card-sg">
        <DialogHeader>
          <DialogTitle>{equipment ? "Editar Equipo" : "Registrar Nuevo Equipo"}</DialogTitle>
          <DialogDescription>
            Complete la información del equipo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Unidad A/C Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación dentro de la sede</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sótano 1, Techo Torre A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Inicial</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="ok">OK</SelectItem>
                            <SelectItem value="critico">Crítico</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Equipo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
