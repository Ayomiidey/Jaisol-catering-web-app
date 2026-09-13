import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

export function AdminDashboardCard() {
  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary p-3 text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold">
              Admin Dashboard
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage orders, catering bookings and customers.
            </p>
          </div>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}