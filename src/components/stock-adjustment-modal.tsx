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
import { IInventoryItem } from "@/lib/data"
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
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface StockAdjustmentModalProps {
  item: IInventoryItem | null
  mode: 'in' | 'out'
  isOpen: boolean
  onClose: () => void
  onSave: (item: IInventoryItem, quantity: number, serials: string[]) => void
}

const adjustmentSchema = z.object({
  quantity: z.coerce.number().positive("La cantidad debe ser positiva.").optional(),
  serialsToAdd: z.string().optional(),
  serialToRemove: z.string().optional(),
})

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export function StockAdjustmentModal({ item, mode, isOpen, onClose, onSave }: StockAdjustmentModalProps) {
  const { toast } = useToast()
  
  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      quantity: 1,
      serialsToAdd: "",
      serialToRemove: "",
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        serialsToAdd: "",
        serialToRemove: "",
      })
    }
  }, [item, mode, isOpen, form])
  
  if (!item) return null;

  const onSubmit = (data: AdjustmentFormValues) => {
    let quantity = data.quantity || 0;
    let serials: string[] = [];
    
    if (item.type === 'generic') {
      if (mode === 'out' && quantity > item.stock) {
        form.setError("quantity", { message: "No hay suficiente stock." });
        return;
      }
    } else { // Serialized
      if (mode === 'in' && data.serialsToAdd) {
        serials = data.serialsToAdd.split(',').map(s => s.trim()).filter(Boolean);
        quantity = serials.length;
      } else if (mode === 'out' && data.serialToRemove) {
        serials = [data.serialToRemove];
        quantity = 1;
      } else {
        // No action taken for serialized
        onClose();
        return;
      }
    }
    
    onSave(item, mode === 'in' ? quantity : -quantity, serials);

    toast({
      title: `Movimiento de Stock Exitoso`,
      description: `Se ${mode === 'in' ? 'agregaron' : 'descontaron'} ${quantity} unidad(es) de ${item.name}.`,
      variant: "success",
    })
    onClose()
  }

  const title = mode === 'in' ? 'Registrar Entrada' : 'Registrar Consumo';
  const description = `Ajuste de stock para el repuesto: ${item.name}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md card-sg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {item.type === 'generic' ? (
                 <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                        <Input type="number" min="1" placeholder="Cantidad" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            ) : mode === 'in' ? (
                 <FormField
                    control={form.control}
                    name="serialsToAdd"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nuevos Seriales</FormLabel>
                        <FormControl>
                         <Textarea placeholder="Serial1, Serial2, Serial3..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            ) : ( // Serialized and 'out'
                 <FormField
                    control={form.control}
                    name="serialToRemove"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Serial a Consumir</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Seleccione un serial" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {item.serials?.map(serial => (
                                    <SelectItem key={serial} value={serial}>{serial}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
           
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Movimiento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
