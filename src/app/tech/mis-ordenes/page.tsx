"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader, CalendarCheck } from "lucide-react"
import { serviceOrders as allServiceOrders, IServiceOrder } from "@/lib/data"
import { TechServiceOrderCard } from "@/components/tech-service-order-card"

export default function MisOrdenesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  const myServiceOrders = useMemo(() => {
    if (!user) return []
    // In a real app, this would be a fetch call filtered by user ID
    // Prioritize by urgency: Crítico > Preventivo > OK
    const sorted = [...allServiceOrders].sort((a, b) => {
        const priority = { 'Crítico': 3, 'Preventivo': 2, 'OK': 1 };
        return (priority[b.equipmentHealth] || 0) - (priority[a.equipmentHealth] || 0);
    });
    return sorted.filter((order) => order.technicianName === user.name)
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-2xl font-bold">Servicios para Hoy</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 md:gap-8 md:p-6">
        {myServiceOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myServiceOrders.map((order) => (
              <TechServiceOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-12 text-center bg-card mt-12">
              <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Todo al día</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No tienes órdenes de servicio asignadas para hoy. ¡Buen trabajo!
              </p>
          </div>
        )}
      </main>
    </div>
  )
}
