'use client'

import Link from 'next/link'
import { CheckCircle2, ShoppingBag } from 'lucide-react'

interface OrderSuccessProps {
  orderId?: string
}

export function OrderSuccess({ orderId }: OrderSuccessProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Order placed successfully!
        </h1>

        <p className="mt-3 text-muted-foreground">
          Thank you for ordering from Jaisol Catering.
        </p>

        {orderId && (
          <p className="mt-2 text-sm text-muted-foreground">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}

        <Link
          href="/explore"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>
    </main>
  )
}