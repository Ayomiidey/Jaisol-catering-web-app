import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CalendarDays,
  Clock,
  MapPin,
} from 'lucide-react'

interface EventDetailsFormProps {
  date: string
  time: string
  location: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  onLocationChange: (value: string) => void
  errors: {
    date?: string
    location?: string
  }
}

export function EventDetailsForm({
  date,
  time,
  location,
  onDateChange,
  onTimeChange,
  onLocationChange,
  errors,
}: EventDetailsFormProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Event details
        </p>

        <h2 className="mt-1 text-xl font-bold">
          When and where?
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Give us the basic details of your event.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-date">
            Event date <span className="text-destructive">*</span>
          </Label>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="event-date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) =>
                onDateChange(event.target.value)
              }
              className="pl-10"
            />
          </div>

          {errors.date && (
            <p className="text-sm text-destructive">
              {errors.date}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-time">
            Event time <span className="text-destructive">*</span>
          </Label>

          <div className="relative">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="event-time"
              type="time"
              value={time}
              onChange={(event) =>
                onTimeChange(event.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="event-location">
            Event location <span className="text-destructive">*</span>
          </Label>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="event-location"
              type="text"
              value={location}
              onChange={(event) =>
                onLocationChange(event.target.value)
              }
              placeholder="Venue name, street, city"
              className="pl-10"
            />
          </div>

          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}