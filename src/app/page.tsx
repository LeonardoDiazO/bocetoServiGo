"use client"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { kpiData } from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceOrderComponent } from "@/components/service-order-component"
import { EquipmentListComponent } from "@/components/equipment-list"

export type Module = 'Dashboard' | 'Clientes' | 'Equipos' | 'Ordenes' | 'Inventario';

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

const PlaceholderContent = ({ module }: { module: string }) => (
  <Card className="card-sg flex h-[50vh] items-center justify-center">
    <CardContent>
      <h1 className="text-4xl font-bold text-muted-foreground">{module}</h1>
    </CardContent>
  </Card>
)

export default function Home() {
  const [currentModule, setCurrentModule] = useState<Module>("Dashboard")

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
            {currentModule === "Clientes" && (
              <PlaceholderContent module="Clientes" />
            )}
            {currentModule === "Equipos" && <EquipmentListComponent />}
            {currentModule === "Ordenes" && <ServiceOrderComponent />}
            {currentModule === "Inventario" && (
              <PlaceholderContent module="Inventario" />
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
