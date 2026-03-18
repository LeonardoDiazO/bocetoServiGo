"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export default function MisOrdenesRedirectPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading) {
        if (user?.role === 'TECH') {
            router.replace('/tech/mis-ordenes')
        } else if (user?.role === 'ADMIN') {
            router.replace('/dashboard')
        } else {
            router.replace('/login')
        }
    }
  }, [router, user, loading])

  return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redireccionando...</p>
      </div>
  )
}
