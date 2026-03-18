"use client"

import Link from "next/link"
import { Building, ChevronDown, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { clients } from "@/lib/data"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b bg-card px-3 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="flex-shrink-0" />
        <Link href="/" className="flex items-center gap-2">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
          >
            <path
              d="M50 12 L56 12 L58 20 C62 22 66 25 69 29 L77 27 L80 33 L73 38 C74 42 74 47 73 51 L80 56 L77 62 L69 60 C66 64 62 67 58 69 L56 77 L50 77 L48 69 C44 67 40 64 37 60 L29 62 L26 56 L33 51 C32 47 32 42 33 38 L26 33 L29 27 L37 29 C40 25 44 22 48 20 L50 12 Z"
              fill="#2563EB"
            />
            <circle cx="50" cy="45" r="20" fill="white" />
            <g transform="rotate(-45 50 45)">
              <path d="M50 12 L60 45 L50 45 Z" fill="#1E3A8A" />
              <path d="M50 12 L40 45 L50 45 Z" fill="#3B82F6" />
              <path d="M50 78 L60 45 L50 45 Z" fill="#C2410C" />
              <path d="M50 78 L40 45 L50 45 Z" fill="#F97316" />
              <circle cx="50" cy="45" r="5" fill="white" />
            </g>
          </svg>
          <div className="hidden xs:flex items-baseline font-bold text-xl">
            <span className="text-foreground">ServiGo</span>
            <span className="text-primary">One</span>
          </div>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <Building className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block whitespace-nowrap">
                Sede Actual
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50 hidden sm:inline-block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Seleccionar Sede</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {clients.map((client) => (
              <DropdownMenuItem key={client.id}>{client.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Ajustes</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user && (
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
