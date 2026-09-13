import {
  ChevronDown,
  Users,
  CalendarDays,
  MapPin,
} from "lucide-react"

import { AdminBooking } from "@/types/catering"
import { BookingDetails } from "./BookingDetails"

interface BookingCardProps {
  booking: AdminBooking
  expanded: boolean
  onToggle: () => void
  onUpdateStatus: (status: AdminBooking["status"]) => void
  onUpdateCost: (cost: number) => void
  isUpdating: boolean
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  completed: "bg-primary/15 text-primary",
  cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function BookingCard({
  booking,
  expanded,
  onToggle,
  onUpdateStatus,
  onUpdateCost,
  isUpdating,
}: BookingCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full grid-cols-1 gap-4 p-4 text-left transition hover:bg-secondary/50 md:grid-cols-5"
      >
        {/* Customer */}
        <div>
          <p className="font-semibold">
            {booking.user.name || "Unknown customer"}
          </p>

          <p className="text-xs text-muted-foreground">
            {booking.eventType}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium">
              {formatDate(booking.date)}
            </p>

            {booking.eventTime && (
              <p className="text-xs text-muted-foreground">
                {booking.eventTime}
              </p>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm">
            {booking.guestCount} guests
          </span>
        </div>

        {/* Location */}
        <div className="hidden items-start gap-2 md:flex">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

          <p className="truncate text-sm text-muted-foreground">
            {booking.location}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between md:justify-end md:gap-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
              statusColors[booking.status]
            }`}
          >
            {booking.status}
          </span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <BookingDetails
          booking={booking}
          onUpdateStatus={onUpdateStatus}
          onUpdateCost={onUpdateCost}
          isUpdating={isUpdating}
        />
      )}
    </div>
  )
}