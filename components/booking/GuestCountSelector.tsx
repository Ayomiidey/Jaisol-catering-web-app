import { Users } from 'lucide-react'

interface GuestCountSelectorProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export function GuestCountSelector({
  value,
  onChange,
  error,
}: GuestCountSelectorProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Guest count
          </p>

          <h2 className="mt-1 text-xl font-bold">
            How many guests?
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Catering is currently available for 20–500 guests.
          </p>
        </div>

        <div className="flex h-14 min-w-20 items-center justify-center gap-2 rounded-xl bg-brand-green-light px-3">
          <Users className="h-5 w-5 text-primary" />

          <span className="text-xl font-bold text-primary">
            {value}
          </span>
        </div>
      </div>

      <input
        type="range"
        min="20"
        max="500"
        step="5"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full accent-[var(--brand-green)]"
      />

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>20 guests</span>
        <span>500 guests</span>
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}