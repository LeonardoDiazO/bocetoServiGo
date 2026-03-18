"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, QrCode, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/tech/mis-ordenes", label: "Mis Órdenes", icon: ClipboardList },
  { href: "/tech/escanear", label: "Escanear QR", icon: QrCode },
  { href: "/tech/perfil", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
