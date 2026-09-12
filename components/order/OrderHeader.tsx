import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export function OrderHeader() {
  return (
    <header className="mb-8">
      <Link
        href="/explore"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to menu
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Your Order
          </h1>

          <p className="text-sm text-muted-foreground">
            Review your items and provide your delivery details.
          </p>
        </div>
      </div>
    </header>
  )
}