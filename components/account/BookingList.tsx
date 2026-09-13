import Link from "next/link"
import { CalendarDays } from "lucide-react"

import { CateringBookingSummary } from "@/types/account"
import { BookingCard } from "./BookingCard"
import { EmptyState } from "./EmptyState"

interface BookingListProps {
  bookings: CateringBookingSummary[]
  isLoading: boolean
}

export function BookingList({
  bookings,
  isLoading,
}: BookingListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-5 w-5" />}
        title="No catering bookings"
        description="Plan your next event with Jaisol Catering."
        action={
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Catering
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
        />
      ))}
    </div>
  )
}