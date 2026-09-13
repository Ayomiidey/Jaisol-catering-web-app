import { CalendarDays, ShoppingBag } from "lucide-react"

interface AccountStatsProps {
  orderCount: number
  bookingCount: number
}

export function AccountStats({
  orderCount,
  bookingCount,
}: AccountStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold">
              {orderCount}
            </p>
          </div>

          <div className="rounded-xl bg-primary/15 p-3 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Catering Bookings
            </p>

            <p className="mt-1 text-3xl font-bold">
              {bookingCount}
            </p>
          </div>

          <div className="rounded-xl bg-primary/15 p-3 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}