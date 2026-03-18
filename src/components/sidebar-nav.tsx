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

import type { Module } from "@/app/page"
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
  const menuItems: { name: Module; icon: React.ReactNode }[] = [
    { name: "Dashboard", icon: <LayoutDashboard /> },
    { name: "Clientes", icon: <Users /> },
    { name: "Equipos", icon: <Wrench /> },
    { name: "Ordenes", icon: <ClipboardList /> },
    { name: "Inventario", icon: <Boxes /> },
  ]

  return (
    <>
      <SidebarContent className="p-2 pt-8">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => setCurrentModule(item.name)}
                isActive={currentModule === item.name}
              >
                {item.icon}
                {item.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
