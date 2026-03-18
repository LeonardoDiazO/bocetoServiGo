import Link from "next/link"
import Image from "next/image"
import {
  Building,
  ChevronDown
} from "lucide-react"

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
  const logo = PlaceHolderImages.find((img) => img.id === "servigo-logo")

  return (
    <header className="flex h-[70px] items-center gap-4 border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center">
          {logo ? (
            <Image
              src={logo.imageUrl}
              alt="ServiGo One Logo"
              width={160}
              height={40}
              priority
              data-ai-hint={logo.imageHint}
            />
          ) : (
            <span className="font-bold text-lg">ServiGo One</span>
          )}
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
            {clients.map(client => (
              <DropdownMenuItem key={client.id}>{client.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                {userAvatar && (
                    <Avatar className="h-9 w-9">
                    <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} data-ai-hint={userAvatar.imageHint} />
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
