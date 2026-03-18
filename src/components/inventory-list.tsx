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
} from "lucide-react"
import { inventory as initialInventory, type IInventoryItem } from "@/lib/data"
import { cn } from "@/lib/utils"

export function InventoryListComponent() {
  const [inventory, setInventory] =
    React.useState<IInventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = React.useState("")

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
  
  const handleCreateNew = () => {
    // Placeholder for opening a "create new item" modal
    alert("Funcionalidad para crear nuevo repuesto no implementada.")
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="card-sg p-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o número de serial..."
              className="w-full pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                  <CardTitle className="text-base font-bold">
                    {item.name}
                  </CardTitle>
                  <Badge
                    variant={item.type === "generic" ? "secondary" : "outline"}
                    className="capitalize shrink-0"
                  >
                    {item.type === "generic" ? "Genérico" : "Serializado"}
                  </Badge>
                </div>
                {isStockCritical(item) && (
                  <Badge
                    variant="destructive"
                    className="w-fit mt-2 bg-accent text-accent-foreground border-transparent"
                  >
                    Stock Crítico
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
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
                 <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Entrada
                </Button>
                <Button variant="secondary" size="sm">
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
  )
}
