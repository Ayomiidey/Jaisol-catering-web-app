import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from 'lucide-react'

interface BookingSummaryProps {
  eventType: string
  guestCount: number
  date: string
  time: string
  location: string
  dietaryNeeds: string[]
}

export function BookingSummary({
  eventType,
  guestCount,
  date,
  time,
  location,
  dietaryNeeds,
}: BookingSummaryProps) {
  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(
        'en-GB',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      )
    : 'Not selected'

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm md:sticky md:top-24">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Your request
        </p>

        <h2 className="mt-1 text-xl font-bold">
          Booking summary
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">
            Event
          </p>

          <p className="mt-1 font-semibold">
            {eventType || 'Not selected'}
          </p>
        </div>

        <div className="flex gap-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Guests
            </p>

            <p className="font-medium">
              {guestCount} guests
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Date
            </p>

            <p className="font-medium">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Time
            </p>

            <p className="font-medium">
              {time || 'Not selected'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Location
            </p>

            <p className="break-words font-medium">
              {location || 'Not selected'}
            </p>
          </div>
        </div>

        {dietaryNeeds.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Dietary preferences
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {dietaryNeeds.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-brand-green-light p-4">
        <p className="text-sm font-semibold text-primary">
          What happens next?
        </p>

        <p className="mt-1 text-sm text-foreground/70">
          We&apos;ll save your request and take you to WhatsApp
          so you can discuss menus, packages, allergies, pricing
          and any other requirements with us.
        </p>
      </div>
    </aside>
  )
}