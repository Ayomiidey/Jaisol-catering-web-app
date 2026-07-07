'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user || !(session.user as any).isAdmin) {
    redirect('/')
  }

  return <>{children}</>
}
