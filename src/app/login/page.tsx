"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, User } from "@/context/auth-context"
import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"

// A simple mock DB of users
const usersDb: { [email: string]: { password: string; user: User } } = {
  "admin@servigo.one": {
    password: "123456",
    user: { name: "Mario Rossi", email: "admin@servigo.one", role: "ADMIN" },
  },
  "tecnico@servigo.one": {
    password: "123456",
    user: { name: "Carlos Mappale", email: "tecnico@servigo.one", role: "TECH" },
  },
}

const ServiGoLogo = ({className}: {className?: string}) => (
     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("h-24 w-24 text-white", className)}>
        <path d="M50 12 L56 12 L58 20 C62 22 66 25 69 29 L77 27 L80 33 L73 38 C74 42 74 47 73 51 L80 56 L77 62 L69 60 C66 64 62 67 58 69 L56 77 L50 77 L48 69 C44 67 40 64 37 60 L29 62 L26 56 L33 51 C32 47 32 42 33 38 L26 33 L29 27 L37 29 C40 25 44 22 48 20 L50 12 Z" fill="currentColor" />
        <circle cx="50" cy="45" r="20" fill="#1E3A8A" />
        <g transform="rotate(-45 50 45)">
            <path d="M50 12 L60 45 L50 45 Z" fill="#1E3A8A" />
            <path d="M50 12 L40 45 L50 45 Z" fill="#3B82F6" />
            <path d="M50 78 L60 45 L50 45 Z" fill="#C2410C" />
            <path d="M50 78 L40 45 L50 45 Z" fill="#F97316" />
            <circle cx="50" cy="45" r="5" fill="white" />
        </g>
    </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("admin@servigo.one")
  const [password, setPassword] = useState("123456")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoggingIn(true)
    
    // Simulate network delay
    setTimeout(() => {
      const lowercasedEmail = email.toLowerCase()
      const userEntry = usersDb[lowercasedEmail]

      if (userEntry && userEntry.password === password) {
        login(userEntry.user)
        // Redirection is handled by auth-context, but we push for faster UI feedback
        if (userEntry.user.role === "ADMIN") {
          router.push("/dashboard")
        } else if (userEntry.user.role === "TECH") {
          router.push("/tech/mis-ordenes")
        }
      } else {
        setError("Credenciales no reconocidas. Inténtalo de nuevo.")
        setIsLoggingIn(false)
      }
    }, 1000)
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 animate-in fade-in-0 duration-500">
      <div className="relative hidden bg-primary-dark lg:flex flex-col items-center justify-center p-10 text-white">
        <div className="absolute inset-0 bg-[#1E3A8A]" />
        <div className="relative z-20 flex flex-col items-center text-center">
            <ServiGoLogo className="mb-6 h-28 w-28" />
            <div className="flex items-baseline font-bold text-5xl mb-4">
                <span className="text-white">ServiGo</span>
                <span className="text-primary">One</span>
            </div>
            <p className="text-xl mt-4 text-white/80">Gestión de activos a escala global</p>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-screen py-24 bg-background relative">
        {isLoggingIn && (
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center">
                     <div className="relative mx-auto flex items-center justify-center h-24 w-24">
                        <ServiGoLogo className="absolute h-full w-full text-primary/20" />
                        <Loader className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <p className="mt-4 font-semibold text-muted-foreground">Validando acceso...</p>
                </div>
            </div>
        )}
        <div className="mx-auto grid w-[380px] gap-8 px-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Acceder a tu Cuenta</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tus credenciales para entrar a la plataforma.
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base rounded-lg"
                disabled={isLoggingIn}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                    "h-12 text-base rounded-lg",
                    error && "ring-2 ring-offset-2 ring-accent/70 animate-shake"
                )}
                disabled={isLoggingIn}
              />
            </div>
             {error && <p className="text-sm font-medium text-destructive -mt-3">{error}</p>}
            <Button type="submit" className="w-full btn-gradient text-white font-semibold h-12 text-base rounded-lg" disabled={isLoggingIn}>
                {isLoggingIn ? 'Accediendo...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
