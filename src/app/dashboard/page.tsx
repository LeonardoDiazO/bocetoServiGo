"use client"

import { useState, useEffect, useMemo } from "react"
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
import { kpiData, equipment, serviceOrders, technicians } from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import { OrderServiceForm } from "@/components/order-service-form"
import { EquipmentListComponent } from "@/components/equipment-list"
import { ClientListComponent } from "@/components/client-list"
import { InventoryListComponent } from "@/components/inventory-list"
import { RecentSales } from "@/components/recent-sales"

export type Module =
  | "Dashboard"
  | "Clientes"
  | "Equipos"
  | "Ordenes"
  | "Inventario"

// ── Badge de estado ────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "Pendiente":  { label: "Pendiente",  bg: "bg-orange-50", text: "text-orange-700", dot: "bg-[#F97316]" },
  "En Proceso": { label: "En Proceso", bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-[#2563EB]" },
  "Completado": { label: "Completada", bg: "bg-green-50",  text: "text-green-700",  dot: "bg-[#16A34A]" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Dashboard Content ──────────────────────────────────────────────────────
const DashboardContent = () => {
    const criticalEquipmentCount = useMemo(() => equipment.filter(eq => eq.status === 'critico').length, [])
    const ordersTodayCount      = useMemo(() => serviceOrders.filter(o => o.time !== 'Ayer').length, [])
    const activeTechniciansCount = useMemo(() => technicians.filter(t => t.id !== 'tech-admin').length, [])

    const updatedKpiData = useMemo(() => kpiData.map(kpi => {
        if (kpi.title === "Equipos Críticos")  return { ...kpi, metric: criticalEquipmentCount.toString() }
        if (kpi.title === "OS Hoy")            return { ...kpi, metric: ordersTodayCount.toString() }
        if (kpi.title === "Técnicos Activos")  return { ...kpi, metric: activeTechniciansCount.toString() }
        return kpi
    }), [criticalEquipmentCount, ordersTodayCount, activeTechniciansCount])

    // Enriquecer órdenes con datos del equipo para la tabla de trazabilidad
    const traceabilityRows = useMemo(() => serviceOrders.slice(0, 8).map((order, idx) => {
        const eq = equipment.find(e => e.name === order.equipmentName)
        const serial = eq ? `SG-${eq.id.toUpperCase()}-${(idx + 1001)}` : `SG-EQ-${1000 + idx}`
        return { ...order, serial, location: eq?.location ?? '—' }
    }), [])

  return (
    <div className="space-y-8">

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[#2563EB]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Indicadores del Día</h2>
        </div>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {updatedKpiData.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </div>

      {/* ── Tabla de Trazabilidad ─────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[#F97316]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Trazabilidad por Serial</h2>
        </div>

        <div
          className="overflow-hidden bg-white"
          style={{
            borderRadius: '1.5rem',
            border: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.01)',
          }}
        >
          {/* Table header */}
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Actividad Reciente</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historial de servicio por número de serie</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {traceabilityRows.length} registros
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Equipo</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Serial</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Cliente</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Último Servicio</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Técnico</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {traceabilityRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-blue-50/40"
                  >
                    {/* Equipo */}
                    <td className="px-4 md:px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                          </svg>
                        </div>
                        <span className="font-semibold text-slate-800 leading-tight text-xs md:text-sm">{row.equipmentName}</span>
                      </div>
                    </td>
                    {/* Serial */}
                    <td className="px-4 md:px-6 py-3.5">
                      <code className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">
                        {row.serial}
                      </code>
                    </td>
                    {/* Cliente — oculto en móvil */}
                    <td className="hidden md:table-cell px-6 py-3.5 text-slate-600 max-w-[160px] truncate">{row.clientName}</td>
                    {/* Último servicio */}
                    <td className="px-4 md:px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <svg className="h-3.5 w-3.5 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="text-xs">{row.time === 'Ayer' ? row.time : `Hoy · ${row.time}`}</span>
                      </div>
                    </td>
                    {/* Técnico — oculto en móvil */}
                    <td className="hidden md:table-cell px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
                        >
                          {row.technicianName.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-600">{row.technicianName}</span>
                      </div>
                    </td>
                    {/* Estado */}
                    <td className="px-4 md:px-6 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
          <main className="flex flex-1 flex-col gap-4 p-3 md:gap-8 md:p-6 lg:p-8">
            {currentModule === "Dashboard" && <DashboardContent />}
            {currentModule === "Clientes" && <ClientListComponent />}
            {currentModule === "Equipos" && <EquipmentListComponent />}
            {currentModule === "Ordenes" && <OrderServiceForm />}
            {currentModule === "Inventario" && <InventoryListComponent />}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
