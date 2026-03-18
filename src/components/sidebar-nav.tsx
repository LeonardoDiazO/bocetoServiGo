"use client"

import {
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  Boxes,
  Settings,
  LogOut,
} from "lucide-react"

import type { Module } from "@/app/dashboard/page"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "./ui/sidebar"

interface SidebarNavProps {
  currentModule: Module
  setCurrentModule: (module: Module) => void
}

export function SidebarNav({
  currentModule,
  setCurrentModule,
}: SidebarNavProps) {
  
  const operationItems: { name: Module; icon: React.ReactNode; tooltip: string }[] = [
    { name: "Clientes", icon: <Users />, tooltip: "Gestión de Clientes" },
    { name: "Equipos", icon: <Wrench />, tooltip: "Gestión de Equipos" },
    { name: "Ordenes", icon: <ClipboardList />, tooltip: "Órdenes de Servicio" },
  ]

  const logisticsItems: { name: Module; icon: React.ReactNode; tooltip: string }[] = [
    { name: "Inventario", icon: <Boxes />, tooltip: "Inventario y Repuestos" },
  ]

  return (
    <>
      <SidebarContent className="p-2 pt-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setCurrentModule("Dashboard")}
              isActive={currentModule === "Dashboard"}
              tooltip="Vista General"
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1 group-data-[collapsible=icon]:hidden">OPERACIÓN</p>
            <SidebarMenu>
                 {operationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                        onClick={() => setCurrentModule(item.name)}
                        isActive={currentModule === item.name}
                        tooltip={item.tooltip}
                        >
                        {item.icon}
                        {item.name}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>

        <div className="mt-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1 group-data-[collapsible=icon]:hidden">LOGÍSTICA</p>
            <SidebarMenu>
                {logisticsItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                        onClick={() => setCurrentModule(item.name)}
                        isActive={currentModule === item.name}
                        tooltip={item.tooltip}
                        >
                        {item.icon}
                        {item.name}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configuración">
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Cerrar Sesión">
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
