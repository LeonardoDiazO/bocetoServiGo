"use client"

import Link from "next/link"
import Image from "next/image"
import { Building, ChevronDown } from "lucide-react"

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
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { clients } from "@/lib/data"

export function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar")

  return (
    <header className="flex h-[70px] items-center gap-4 border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
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
          <div className="flex items-baseline font-bold text-xl">
            <span className="text-foreground">ServiGo</span>
            <span className="text-primary">One</span>
          </div>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
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
                className="relative h-9 w-9 rounded-full"
              >
                {userAvatar && (
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={userAvatar.imageUrl}
                      alt={userAvatar.description}
                      data-ai-hint={userAvatar.imageHint}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ajustes</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="text-sm font-medium">Mario Rossi</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}
