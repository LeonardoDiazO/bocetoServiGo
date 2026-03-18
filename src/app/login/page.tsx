"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, User } from "@/context/auth-context"
import { Loader } from "lucide-react"

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

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [email, setEmail] = useState("admin@servigo.one")
  const [password, setPassword] = useState("123456")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = () => {
    setIsLoggingIn(true)
    // Basic validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, ingrese su correo y contraseña.",
      })
      setIsLoggingIn(false)
      return
    }
    
    // Simulate network delay
    setTimeout(() => {
      const lowercasedEmail = email.toLowerCase()
      const userEntry = usersDb[lowercasedEmail]

      if (userEntry && userEntry.password === password) {
        login(userEntry.user)
        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo...",
        })

        if (userEntry.user.role === "ADMIN") {
          router.push("/dashboard")
        } else if (userEntry.user.role === "TECH") {
          router.push("/tech/mis-ordenes")
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error de Autenticación",
          description: "Credenciales no reconocidas. Inténtalo de nuevo.",
        })
      }
      setIsLoggingIn(false)
    }, 500)
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 animate-in fade-in-0 duration-500">
      <div className="relative hidden bg-primary-dark lg:flex flex-col items-center justify-center p-10 text-white">
        <div className="absolute inset-0 bg-primary-dark" />
        <div className="relative z-20 flex flex-col items-center text-center">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4">
              <path d="M50 12 L56 12 L58 20 C62 22 66 25 69 29 L77 27 L80 33 L73 38 C74 42 74 47 73 51 L80 56 L77 62 L69 60 C66 64 62 67 58 69 L56 77 L50 77 L48 69 C44 67 40 64 37 60 L29 62 L26 56 L33 51 C32 47 32 42 33 38 L26 33 L29 27 L37 29 C40 25 44 22 48 20 L50 12 Z" fill="white" />
              <circle cx="50" cy="45" r="20" fill="#1E3A8A" />
              <g transform="rotate(-45 50 45)">
                  <path d="M50 12 L60 45 L50 45 Z" fill="#1E3A8A" />
                  <path d="M50 12 L40 45 L50 45 Z" fill="#3B82F6" />
                  <path d="M50 78 L60 45 L50 45 Z" fill="#F97316" />
                  <path d="M50 78 L40 45 L50 45 Z" fill="#C2410C" />
                  <circle cx="50" cy="45" r="5" fill="white" />
              </g>
          </svg>
          <div className="flex items-baseline font-bold text-5xl mb-4">
              <span className="text-white">ServiGo</span>
              <span className="text-primary">One</span>
          </div>
          <p className="text-xl mt-4 text-white/80">Plataforma Inteligente de Gestión de Activos</p>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-screen py-12 bg-white">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-text-main">Acceder</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tus credenciales para entrar a la plataforma.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <Button onClick={handleLogin} type="submit" className="w-full btn-gradient text-white font-semibold" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Accediendo...
                </>
              ) : (
                'Acceder'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
