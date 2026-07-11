'use client'

import React, { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { store } from '@/lib/store'
import { queryClient } from '@/lib/query-client'
import { BottomNav } from './bottom-nav'
import { DesktopHeader } from './desktop-header'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <DesktopHeader />
          {children}
          <BottomNav />
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  )
}
