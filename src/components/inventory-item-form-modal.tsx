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
import { IInventoryItem, InventoryItemType, technicians } from "@/lib/data"
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

interface InventoryItemFormModalProps {
  item: IInventoryItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: IInventoryItem) => void
}

const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  type: z.enum(["generic", "serialized"], { required_error: "Debe seleccionar un tipo." }),
  criticalStockLevel: z.coerce.number().min(0, "El stock crítico no puede ser negativo."),
  location: z.string().min(3, "La ubicación es requerida."),
  stock: z.coerce.number().min(0, "El stock inicial no puede ser negativo.").optional(),
  serials: z.string().optional(), // For new serialized items
})

type InventoryFormValues = z.infer<typeof itemSchema>;

const defaultValues: Omit<IInventoryItem, "stock" | "serials"> = {
  id: "",
  name: "",
  type: "generic",
  criticalStockLevel: 5,
  location: "Bodega Principal",
}

export function InventoryItemFormModal({ item, isOpen, onClose, onSave }: InventoryItemFormModalProps) {
  const { toast } = useToast()
  
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ? { ...item, serials: item.serials?.join(', ') } : { ...defaultValues, id: "", stock: 0, serials: "" },
  })
  
  const itemType = form.watch("type");

  React.useEffect(() => {
    if (isOpen) {
      form.reset(item ? { ...item, serials: item.serials?.join(', ') } : { ...defaultValues, id: "", stock: 0, serials: "" })
    }
  }, [item, isOpen, form])

  const onSubmit = (data: InventoryFormValues) => {
    const isCreating = !item?.id;

    const itemToSave: IInventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      name: data.name,
      type: data.type,
      criticalStockLevel: data.criticalStockLevel,
      location: data.location,
      stock: isCreating && data.type === 'generic' ? (data.stock || 0) : (item?.stock || 0),
      serials: isCreating && data.type === 'serialized' && data.serials ? data.serials.split(',').map(s => s.trim()).filter(Boolean) : (item?.serials || []),
    };

    // If creating a serialized item, stock is the number of serials
    if (isCreating && itemToSave.type === 'serialized') {
        itemToSave.stock = itemToSave.serials?.length || 0;
    }

    onSave(itemToSave)
    toast({
      title: "Repuesto Guardado",
      description: `El repuesto ${itemToSave.name} ha sido guardado exitosamente.`,
      variant: "success",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] card-sg">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Repuesto" : "Crear Nuevo Repuesto"}</DialogTitle>
          <DialogDescription>
            Complete la información del repuesto en el inventario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Repuesto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Filtro de Aire 20x20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!item}>
                       <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="generic">Genérico (por cantidad)</SelectItem>
                            <SelectItem value="serialized">Serializado (único)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="criticalStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Crítico</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una ubicación" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Bodega Principal">Bodega Principal</SelectItem>
                                {technicians.map(tech => (
                                    <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {!item && itemType === 'generic' && (
                 <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stock Inicial</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Cantidad inicial" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
             {!item && itemType === 'serialized' && (
                 <FormField
                    control={form.control}
                    name="serials"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Seriales Iniciales</FormLabel>
                        <FormControl>
                         <Input placeholder="Serial1, Serial2, Serial3..." {...field} />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                    )}
                />
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Repuesto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
