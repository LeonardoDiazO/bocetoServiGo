"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
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
    return allServiceOrders.filter((order) => order.technicianName === user.name)
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
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold">Mis Servicios de Hoy</h1>
        {myServiceOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myServiceOrders.map((order) => (
              <TechServiceOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-12 text-center bg-card">
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
