import { AdminBooking } from "@/types/catering"
import { BookingContact } from "./BookingContact"
import { BookingCostEditor } from "./BookingCostEditor"
import { BookingStatusEditor } from "./BookingStatusEditor"

interface BookingDetailsProps {
  booking: AdminBooking
  onUpdateStatus: (status: AdminBooking["status"]) => void
  onUpdateCost: (cost: number) => void
  isUpdating: boolean
}

function parseDietaryNeeds(value?: string | null) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return null
    }

    return parsed.join(", ")
  } catch {
    return value
  }
}

function formatCreatedAt(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function BookingDetails({
  booking,
  onUpdateStatus,
  onUpdateCost,
  isUpdating,
}: BookingDetailsProps) {
  const dietaryNeeds = parseDietaryNeeds(
    booking.dietaryNeeds
  )

  return (
    <div className="space-y-6 border-t border-border bg-background/50 p-4">
      <BookingContact booking={booking} />

      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <div>
          <p className="mb-1 text-muted-foreground">
            Location
          </p>

          <p>{booking.location}</p>
        </div>

        <div>
          <p className="mb-1 text-muted-foreground">
            Booking ID
          </p>

          <p className="break-all font-mono text-xs">
            {booking.id}
          </p>
        </div>

        <div>
          <p className="mb-1 text-muted-foreground">
            Booking Created
          </p>

          <p>{formatCreatedAt(booking.createdAt)}</p>
        </div>

        <div>
          <p className="mb-1 text-muted-foreground">
            Dietary Information
          </p>

          <p>
            {dietaryNeeds ||
              "Discuss allergies and dietary requirements on WhatsApp"}
          </p>
        </div>

        {booking.notes && (
          <div className="md:col-span-2">
            <p className="mb-1 text-muted-foreground">
              Customer Notes
            </p>

            <p className="italic">
              {booking.notes}
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <p className="mb-1 text-muted-foreground">
            Catering Package
          </p>

          <p>
            Package, menu and final pricing to be discussed
            with the customer on WhatsApp.
          </p>
        </div>
      </div>

      <BookingCostEditor
        currentCost={booking.estimatedCost}
        onSave={onUpdateCost}
        isUpdating={isUpdating}
      />

      <BookingStatusEditor
        currentStatus={booking.status}
        onChange={onUpdateStatus}
        isUpdating={isUpdating}
      />
    </div>
  )
}