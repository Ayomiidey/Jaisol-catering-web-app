'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.replace('/sign-in?callbackUrl=/admin')
    } else if (!(session.user as any).isAdmin) {
      router.replace('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-orange-500 animate-pulse" />
          <p className="text-muted-foreground text-sm">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || !(session.user as any).isAdmin) {
    return null
  }

  return <>{children}</>
}
