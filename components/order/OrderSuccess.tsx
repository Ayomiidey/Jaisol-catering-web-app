'use client'

import Link from 'next/link'
import { CheckCircle2, ExternalLink, ShoppingBag } from 'lucide-react'

interface OrderSuccessProps {
  orderId?: string
  whatsappUrl: string
  onMessageSent: () => void
}

export function OrderSuccess({
  orderId,
  whatsappUrl,
  onMessageSent,
}: OrderSuccessProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">Your order is saved</h1>

        <p className="mt-3 text-muted-foreground">
          Your order details are ready in WhatsApp. Send the message to Jaisol
          Catering to complete your request. We'll reply to confirm availability,
          delivery, and payment.
        </p>

        {orderId && (
          <p className="mt-3 text-sm text-muted-foreground">
            Reference: <span className="font-medium">{orderId}</span>
          </p>
        )}

        <div className="mt-7 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            Open WhatsApp order
          </a>

          <button
            type="button"
            onClick={onMessageSent}
            className="w-full rounded-xl border px-5 py-3 font-semibold transition hover:bg-secondary"
          >
            I've sent the message
          </button>

          <p className="text-xs text-muted-foreground">
            Your cart will stay here until you confirm that you sent the message.
          </p>
        </div>

        <Link
          href="/explore"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>
    </main>
  )
}
