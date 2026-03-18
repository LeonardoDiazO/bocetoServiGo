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
import { IClient } from "@/lib/data"
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
import { useToast } from "@/hooks/use-toast"

interface ClientFormModalProps {
  client: IClient | null
  isOpen: boolean
  onClose: () => void
  onSave: (client: IClient) => void
}

const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  nit: z.string().min(5, "El NIT/Documento es requerido."),
  phone: z.string().min(7, "El teléfono es requerido."),
  email: z.string().email("Email inválido."),
  address: z.string().min(5, "La dirección es requerida."),
  city: z.string().min(3, "La ciudad es requerida."),
  sites: z.array(z.object({ id: z.string(), name: z.string(), address: z.string() })).optional(),
})

const defaultValues: IClient = {
  id: "",
  name: "",
  nit: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  sites: [],
}

export function ClientFormModal({ client, isOpen, onClose, onSave }: ClientFormModalProps) {
  const { toast } = useToast()
  
  const form = useForm<IClient>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || defaultValues,
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset(client || defaultValues)
    }
  }, [client, isOpen, form])

  const onSubmit = (data: IClient) => {
    const clientToSave = {
      ...data,
      id: client?.id || `cliente-${Date.now()}`, // Assign new ID if creating
      sites: client?.sites || [], // Preserve existing sites
    };
    onSave(clientToSave)
    toast({
      title: "Cliente Guardado",
      description: `El cliente ${clientToSave.name} ha sido guardado exitosamente.`,
      variant: "success",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] card-sg">
        <DialogHeader>
          <DialogTitle>{client ? "Editar Cliente" : "Crear Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            Complete la información del cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT/Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="NIT o documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                        <Input placeholder="Dirección principal" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                        <Input placeholder="Ciudad" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cliente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
