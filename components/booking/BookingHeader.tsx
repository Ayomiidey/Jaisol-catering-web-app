import { CalendarDays } from 'lucide-react'

export function BookingHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-light">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">
            Jaisol Catering
          </p>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Book Catering
          </h1>
        </div>
      </div>

      <p className="text-muted-foreground max-w-2xl">
        Tell us about your event and we&apos;ll help you arrange the
        perfect catering. After submitting your request, you&apos;ll
        continue the conversation with us on WhatsApp.
      </p>
    </div>
  )
}