"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { equipment as initialEquipment, clients, type IEquipment, EquipmentStatus } from "@/lib/data"
import { Building, Search, Tag, Pencil, Trash2, PlusCircle, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EquipmentFormModal } from "./equipment-form-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface EnrichedEquipment extends IEquipment {
  clientName: string
}

const initialEnrichedEquipment: EnrichedEquipment[] = initialEquipment.map((eq) => {
  const client = clients.find((c) => c.id === eq.clientId)
  return {
    ...eq,
    clientName: client ? client.name : "Cliente Desconocido",
  }
})

export function EquipmentListComponent() {
  const [equipmentList, setEquipmentList] = React.useState<EnrichedEquipment[]>(initialEnrichedEquipment)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<EquipmentStatus | "all">("all")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingEquipment, setEditingEquipment] = React.useState<IEquipment | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = React.useState<IEquipment | null>(null)
  const { toast } = useToast()

  const filteredEquipment = React.useMemo(() => {
    return equipmentList.filter((eq) => {
      const matchesSearch =
        !searchTerm ||
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || eq.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [equipmentList, searchTerm, statusFilter])

  const getStatusBorderClass = (status: "ok" | "critico") => {
    if (status === "critico") {
      return "border-l-4 border-accent"
    }
    return "border-l-4 border-success"
  }
  
  const handleCreateNew = () => {
    setEditingEquipment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (eq: IEquipment) => {
    setEditingEquipment(eq)
    setIsModalOpen(true)
  }

  const handleSave = (equipmentToSave: IEquipment) => {
    const client = clients.find((c) => c.id === equipmentToSave.clientId);
    const enriched = {
        ...equipmentToSave,
        clientName: client ? client.name : "Cliente Desconocido",
    }
    setEquipmentList(prevList => {
        const exists = prevList.some(e => e.id === enriched.id);
        if (exists) {
            return prevList.map(e => e.id === enriched.id ? enriched : e);
        }
        return [...prevList, enriched];
    });
    toast({
        title: "Equipo Guardado",
        description: `El equipo ${equipmentToSave.name} ha sido guardado.`,
        variant: "success",
    })
    setIsModalOpen(false);
    setEditingEquipment(null);
  }

  const openDeleteDialog = (eq: IEquipment) => {
    setEquipmentToDelete(eq);
    setIsDeleteDialogOpen(true);
  }

  const handleDelete = () => {
    if (!equipmentToDelete) return;
    setEquipmentList((prev) => prev.filter((e) => e.id !== equipmentToDelete.id));
    toast({
      title: "Equipo Eliminado",
      description: `El equipo ${equipmentToDelete.name} ha sido eliminado.`,
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };


  return (
    <>
      <Card className="card-sg w-full max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Gestión de Equipos</CardTitle>
              <CardDescription>
                Registra, edita y administra los equipos de tus clientes.
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Equipo
            </Button>
          </div>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-2" />
            <Input
              type="search"
              placeholder="Buscar por equipo, cliente o sede..."
              className="w-full pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Filtrar por estado:</span>
            <Button
              size="sm"
              variant={statusFilter === "all" ? "secondary" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "critico" ? "default" : "outline"}
              className={cn(
                statusFilter === "critico" &&
                  "bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
              )}
              onClick={() => setStatusFilter("critico")}
            >
              Críticos
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "ok" ? "default" : "outline"}
              className={cn(
                statusFilter === "ok" &&
                  "bg-success hover:bg-success/90 text-success-foreground border-success"
              )}
              onClick={() => setStatusFilter("ok")}
            >
              OK
            </Button>
          </div>
          
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
                        className={cn("capitalize shrink-0 border-transparent", {
                          "bg-accent text-accent-foreground":
                            eq.status === "critico",
                          "bg-success text-success-foreground": eq.status === "ok",
                        })}
                      >
                        {eq.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{eq.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{eq.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 grid grid-cols-2 gap-2">
                     <Button variant="outline" size="sm" onClick={() => handleEdit(eq)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(eq)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-dashed border-2 rounded-lg">
              <Wrench className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="text-2xl font-semibold tracking-tight">No se encontraron equipos</h3>
              <p className="text-muted-foreground max-w-md">
                Prueba a cambiar los filtros o empieza por registrar tu primer equipo.
              </p>
               <Button onClick={handleCreateNew} size="lg" className="mt-4">
                <PlusCircle className="mr-2" />
                Registrar Equipo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false)
            setEditingEquipment(null)
        }}
        equipment={editingEquipment}
        onSave={handleSave}
        clients={clients}
      />

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo
               "{equipmentToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
