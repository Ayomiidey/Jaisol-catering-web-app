import Link from "next/link"
import {
  CalendarDays,
  ShoppingBag,
  ArrowRight,
} from "lucide-react"

export function AccountQuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/menu"
        className="flex h-14 items-center justify-between rounded-2xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <span className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5" />
          Order Food
        </span>

        <ArrowRight className="h-5 w-5" />
      </Link>

      <Link
        href="/book"
        className="flex h-14 items-center justify-between rounded-2xl border bg-background px-5 font-semibold transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />
          Book Catering
        </span>

        <ArrowRight className="h-5 w-5 text-primary" />
      </Link>
    </div>
  )
}