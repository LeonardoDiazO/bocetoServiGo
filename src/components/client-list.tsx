"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { clients as initialClients, type IClient } from "@/lib/data"
import { ClientFormModal } from "./client-form-modal"
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
import { useToast } from "@/hooks/use-toast"

export function ClientListComponent() {
  const [clients, setClients] = React.useState<IClient[]>(initialClients)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingClient, setEditingClient] = React.useState<IClient | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [clientToDelete, setClientToDelete] = React.useState<IClient | null>(null)
  const { toast } = useToast()

  const filteredClients = React.useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nit.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [clients, searchTerm])

  const handleCreateNew = () => {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  const handleEdit = (client: IClient) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleSave = (clientToSave: IClient) => {
    setClients((prevClients) => {
      const exists = prevClients.some((c) => c.id === clientToSave.id)
      if (exists) {
        return prevClients.map((c) => (c.id === clientToSave.id ? clientToSave : c))
      }
      return [...prevClients, clientToSave]
    })
    setIsModalOpen(false)
    setEditingClient(null)
  }
  
  const openDeleteDialog = (client: IClient) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!clientToDelete) return;
    setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
    toast({
      title: "Cliente Eliminado",
      description: `El cliente ${clientToDelete.name} ha sido eliminado.`,
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  return (
    <>
      <Card className="card-sg w-full max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Gestión de Clientes</CardTitle>
              <CardDescription>
                Crea, edita y administra tus clientes y sus sedes.
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Cliente
            </Button>
          </div>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-2" />
            <Input
              type="search"
              placeholder="Buscar por nombre o NIT..."
              className="w-full pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">NIT/Documento</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.nit}</TableCell>
                        <TableCell className="hidden lg:table-cell">{client.email}</TableCell>
                        <TableCell className="hidden sm:table-cell">{client.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Building className="h-4 w-4" />
                              <span className="sr-only">Ver Sedes</span>
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(client)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                             <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(client)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron clientes con ese criterio.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="text-2xl font-semibold tracking-tight">Aún no tienes clientes</h3>
              <p className="text-muted-foreground max-w-md">
                Empieza a centralizar la información para una gestión más eficiente.
              </p>
              <Button onClick={handleCreateNew} size="lg" className="mt-4">
                <PlusCircle className="mr-2" />
                Agregar mi primer cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingClient(null)
        }}
        client={editingClient}
        onSave={handleSave}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente
               "{clientToDelete?.name}".
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
