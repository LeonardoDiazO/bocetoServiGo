"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Archive,
  Search,
  PlusCircle,
  MinusCircle,
  Warehouse,
  Boxes,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { inventory as initialInventory, type IInventoryItem } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { InventoryItemFormModal } from "./inventory-item-form-modal"
import { StockAdjustmentModal } from "./stock-adjustment-modal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function InventoryListComponent() {
  const [inventory, setInventory] = React.useState<IInventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  // Modal States
  const [isItemFormModalOpen, setIsItemFormModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<IInventoryItem | null>(null);
  
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = React.useState(false);
  const [adjustmentItem, setAdjustmentItem] = React.useState<IInventoryItem | null>(null);
  const [adjustmentMode, setAdjustmentMode] = React.useState<'in' | 'out'>('in');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<IInventoryItem | null>(null);


  const filteredInventory = React.useMemo(() => {
    if (!searchTerm) return inventory

    return inventory.filter((item) => {
      const term = searchTerm.toLowerCase()
      const nameMatch = item.name.toLowerCase().includes(term)
      const serialMatch =
        item.type === "serialized" &&
        item.serials?.some((s) => s.toLowerCase().includes(term))
      return nameMatch || serialMatch
    })
  }, [inventory, searchTerm])
  
  // --- CRUD Handlers ---

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsItemFormModalOpen(true);
  }

  const handleEdit = (item: IInventoryItem) => {
    setEditingItem(item);
    setIsItemFormModalOpen(true);
  }

  const handleSaveItem = (itemToSave: IInventoryItem) => {
    setInventory((prev) => {
      const exists = prev.some((i) => i.id === itemToSave.id);
      if (exists) {
        return prev.map((i) => (i.id === itemToSave.id ? itemToSave : i));
      }
      return [...prev, itemToSave];
    });
    setIsItemFormModalOpen(false);
  }

  const openDeleteDialog = (item: IInventoryItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    setInventory((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    toast({
      title: "Repuesto Eliminado",
      description: `El repuesto ${itemToDelete.name} ha sido eliminado.`,
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // --- Stock Adjustment Handlers ---

  const handleOpenAdjustmentModal = (item: IInventoryItem, mode: 'in' | 'out') => {
    setAdjustmentItem(item);
    setAdjustmentMode(mode);
    setIsAdjustmentModalOpen(true);
  }

  const handleSaveAdjustment = (item: IInventoryItem, quantity: number, serials: string[]) => {
    setInventory(prev => prev.map(invItem => {
        if (invItem.id === item.id) {
            const newStock = invItem.stock + quantity;
            let newSerials = invItem.serials ? [...invItem.serials] : [];

            if (item.type === 'serialized') {
                if (quantity > 0) { // 'in' mode
                    newSerials = [...newSerials, ...serials];
                } else { // 'out' mode
                    newSerials = newSerials.filter(s => !serials.includes(s));
                }
            }
            return { ...invItem, stock: newStock, serials: newSerials };
        }
        return invItem;
    }));
  }

  const isStockCritical = (item: IInventoryItem) => {
    return item.stock <= item.criticalStockLevel
  }
  
  const getStatusBorderClass = (item: IInventoryItem) => {
    if (isStockCritical(item)) {
      return "border-l-4 border-accent"
    }
    return "border-l-4 border-transparent"
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <Card className="card-sg p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Buscar por nombre o número de serial..."
                    className="w-full pl-10 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreateNew} className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Repuesto
                </Button>
            </div>
        </Card>

        {inventory.length === 0 ? (
          <Card className="card-sg">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                  <Boxes className="h-16 w-16 text-muted-foreground/30" />
                  <h3 className="text-2xl font-semibold tracking-tight">Tu inventario está vacío</h3>
                  <p className="text-muted-foreground max-w-md">
                      Registra tus repuestos y equipos para empezar a gestionar tu stock.
                  </p>
                  <Button onClick={handleCreateNew} size="lg" className="mt-4">
                      <PlusCircle className="mr-2" />
                      Agregar mi primer repuesto
                  </Button>
              </CardContent>
          </Card>
        ) : filteredInventory.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredInventory.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "card-sg transition-all flex flex-col",
                  getStatusBorderClass(item)
                )}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-bold pr-2">
                      {item.name}
                    </CardTitle>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => openDeleteDialog(item)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                   <Badge
                      variant={item.type === "generic" ? "secondary" : "outline"}
                      className="capitalize shrink-0 w-fit"
                    >
                      {item.type === "generic" ? "Genérico" : "Serializado"}
                    </Badge>
                  {isStockCritical(item) && (
                    <Badge
                      variant="destructive"
                      className="w-fit mt-2 bg-accent text-accent-foreground border-transparent"
                    >
                      Stock Crítico
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-grow space-y-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-lg">{item.stock}</span>
                    <span className="text-muted-foreground">
                      {item.type === "generic" ? "unidades" : "en stock"}
                    </span>
                  </div>
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Warehouse className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pt-4">
                   <Button variant="outline" size="sm" onClick={() => handleOpenAdjustmentModal(item, 'in')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Entrada
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenAdjustmentModal(item, 'out')} disabled={item.stock === 0}>
                     <MinusCircle className="mr-2 h-4 w-4" />
                    Consumir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-sg flex h-48 items-center justify-center">
            <p className="text-muted-foreground">
              No se encontraron repuestos con ese criterio.
            </p>
          </Card>
        )}
      </div>

       <InventoryItemFormModal 
            isOpen={isItemFormModalOpen}
            onClose={() => setIsItemFormModalOpen(false)}
            item={editingItem}
            onSave={handleSaveItem}
       />

       <StockAdjustmentModal
            isOpen={isAdjustmentModalOpen}
            onClose={() => setIsAdjustmentModalOpen(false)}
            item={adjustmentItem}
            mode={adjustmentMode}
            onSave={handleSaveAdjustment}
       />

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el repuesto
               "{itemToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
