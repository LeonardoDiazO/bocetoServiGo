"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { kpiData } from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import { ServiceOrderComponent } from "@/components/service-order-component"
import { EquipmentListComponent } from "@/components/equipment-list"
import { ClientListComponent } from "@/components/client-list"
import { InventoryListComponent } from "@/components/inventory-list"

export type Module =
  | "Dashboard"
  | "Clientes"
  | "Equipos"
  | "Ordenes"
  | "Inventario"

const DashboardContent = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
      {/* You can add more dashboard widgets here */}
    </div>
  )
}

export default function DashboardPage() {
  const [currentModule, setCurrentModule] = useState<Module>("Dashboard")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role === "TECH") {
        router.replace("/tech/mis-ordenes")
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {currentModule === "Dashboard" && <DashboardContent />}
            {currentModule === "Clientes" && <ClientListComponent />}
            {currentModule === "Equipos" && <EquipmentListComponent />}
            {currentModule === "Ordenes" && <ServiceOrderComponent />}
            {currentModule === "Inventario" && <InventoryListComponent />}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
