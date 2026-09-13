import {
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react"

import { CateringBookingSummary } from "@/types/account"

interface BookingCardProps {
  booking: CateringBookingSummary
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-primary/15 text-primary"

    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"

    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"

    case "completed":
      return "bg-primary/15 text-primary"

    default:
      return "bg-muted text-muted-foreground"
  }
}

export function BookingCard({
  booking,
}: BookingCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {booking.event}
          </p>

          <p className="mt-1 font-bold">
            Booking #{booking.id.slice(-8)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          {new Date(booking.date).toLocaleDateString()}
        </div>

        {booking.eventTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {booking.eventTime}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">
            {booking.location}
          </span>
        </div>
      </div>
    </div>
  )
}