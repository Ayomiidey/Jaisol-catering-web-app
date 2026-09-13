import { AdminBooking } from "@/types/catering"
import { BookingCard } from "./BookingCard"

interface BookingListProps {
  bookings: AdminBooking[]
  expandedId: string | null
  onToggle: (id: string) => void
  onUpdateStatus: (id: string, status: AdminBooking["status"]) => void
  onUpdateCost: (id: string, cost: number) => void
  isUpdating: boolean
}

export function BookingList({
  bookings,
  expandedId,
  onToggle,
  onUpdateStatus,
  onUpdateCost,
  isUpdating,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-12 text-center">
        <p className="text-muted-foreground">
          No bookings found
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          expanded={expandedId === booking.id}
          onToggle={() => onToggle(booking.id)}
          onUpdateStatus={(status) =>
            onUpdateStatus(booking.id, status)
          }
          onUpdateCost={(cost) =>
            onUpdateCost(booking.id, cost)
          }
          isUpdating={isUpdating}
        />
      ))}
    </div>
  )
}