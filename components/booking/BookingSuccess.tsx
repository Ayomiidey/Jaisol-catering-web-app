import Link from 'next/link'
import { CheckCircle2, MessageCircle } from 'lucide-react'

interface BookingSuccessProps {
  bookingId: string
}

export function BookingSuccess({
  bookingId,
}: BookingSuccessProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-light">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
          Request received
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Your catering request is saved
        </h1>

        <p className="mt-4 text-muted-foreground">
          Your booking has been added to our system. Continue
          on WhatsApp to discuss your menu, package, allergies,
          final requirements and pricing.
        </p>

        <div className="mt-6 rounded-xl bg-secondary p-4">
          <p className="text-xs text-muted-foreground">
            Booking reference
          </p>

          <p className="mt-1 break-all font-mono text-sm font-semibold">
            {bookingId}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            Back to Home
          </Link>

          <Link
            href="/book"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            New Request
          </Link>
        </div>
      </div>
    </div>
  )
}