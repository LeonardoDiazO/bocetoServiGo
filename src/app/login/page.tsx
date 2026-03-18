"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, User } from "@/context/auth-context"
import { Loader, User as UserIcon, Lock } from "lucide-react"
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
     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={cn("h-24 w-24", className)}>
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
    <div
      className="w-full min-h-screen animate-in fade-in-0 duration-500"
      style={{ display: 'grid', gridTemplateColumns: '60% 40%' }}
    >
      {/* ── Lado Izquierdo: Marca (60%) ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center p-16 text-white relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #1E40AF 100%)',
        }}
      >
        {/* Decorative blurred orb */}
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: '480px',
            height: '480px',
            background: 'radial-gradient(circle, #3B82F6, transparent 70%)',
            top: '-80px',
            right: '-80px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <ServiGoLogo className="mb-8 h-32 w-32 text-white drop-shadow-xl" />
          <div className="flex items-baseline font-extrabold mb-6" style={{ fontSize: '52px', letterSpacing: '-1px' }}>
            <span className="text-white">ServiGo</span>
            <span style={{ color: '#93C5FD' }}>One</span>
          </div>
          <p
            className="text-white/80 leading-relaxed max-w-xs"
            style={{ fontSize: '24px', fontWeight: 400 }}
          >
            Gestión Inteligente de Activos y Servicios de Campo
          </p>
          {/* Subtle divider */}
          <div className="mt-10 w-16 border-t border-white/20" />
          <p className="mt-6 text-white/50 text-sm tracking-wide uppercase">
            Plataforma Empresarial ServiGo
          </p>
        </div>
      </div>

      {/* ── Lado Derecho: Formulario (40%) ──────────────────────────── */}
      <div
        className="flex items-center justify-center min-h-screen relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(147,197,253,0.12) 0%, #F8FAFC 65%)',
        }}
      >
        {/* Loading overlay */}
        {isLoggingIn && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <div className="relative mx-auto flex items-center justify-center h-24 w-24">
                <ServiGoLogo className="absolute h-full w-full text-primary/20" />
                <Loader className="h-12 w-12 text-primary animate-spin" />
              </div>
              <p className="mt-4 font-semibold text-slate-500">Validando acceso...</p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div
          className="w-full mx-8"
          style={{ maxWidth: '400px' }}
        >
          {/* Card container */}
          <div
            className="bg-white px-10 py-12"
            style={{
              borderRadius: '1.75rem',
              boxShadow: '0 20px 40px -10px rgba(30,58,138,0.10), 0 4px 16px -4px rgba(0,0,0,0.06)',
              border: '1px solid rgba(226,232,240,0.8)',
            }}
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="flex lg:hidden justify-center mb-4">
                <ServiGoLogo className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Acceder a tu Cuenta
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Ingresa tus credenciales para entrar a la plataforma.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggingIn}
                    className="pl-10 h-12 text-sm bg-slate-50 border-slate-200 rounded-xl transition-all duration-200
                      focus-visible:bg-white focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-[#93C5FD]/60 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                    className={cn(
                      "pl-10 h-12 text-sm bg-slate-50 border-slate-200 rounded-xl transition-all duration-200 focus-visible:bg-white focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-[#93C5FD]/60 focus-visible:ring-offset-0",
                      error && "ring-2 ring-offset-0 ring-red-300 border-red-300 animate-shake bg-red-50"
                    )}
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-xs font-medium text-red-500 -mt-2 pl-1">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="mt-1 w-full h-12 rounded-xl text-sm font-semibold text-white tracking-wide
                  transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: 'radial-gradient(ellipse at center, #2563EB 0%, #1E40AF 100%)',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                }}
              >
                {isLoggingIn ? 'Accediendo...' : 'Entrar'}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            © 2025 ServiGo One · Plataforma Empresarial
          </p>
        </div>
      </div>
    </div>
  )
}
