import {
  Cake,
  Building2,
  Heart,
  Baby,
  MoreHorizontal,
} from 'lucide-react'

const EVENT_TYPES = [
  {
    value: 'Wedding',
    label: 'Wedding',
    icon: Heart,
  },
  {
    value: 'Birthday',
    label: 'Birthday',
    icon: Cake,
  },
  {
    value: 'Corporate',
    label: 'Corporate',
    icon: Building2,
  },
  {
    value: 'Naming',
    label: 'Naming',
    icon: Baby,
  },
  {
    value: 'Other',
    label: 'Other',
    icon: MoreHorizontal,
  },
]

interface EventTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function EventTypeSelector({
  value,
  onChange,
  error,
}: EventTypeSelectorProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Step 01
        </p>

        <h2 className="mt-1 text-xl font-bold">
          What are you celebrating?
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose the type of event you&apos;re planning.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {EVENT_TYPES.map((event) => {
          const Icon = event.icon
          const selected = value === event.value

          return (
            <button
              key={event.value}
              type="button"
              onClick={() => onChange(event.value)}
              className={`group flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                selected
                  ? 'border-primary bg-brand-green-light text-primary shadow-sm'
                  : 'border-border bg-background hover:border-primary/40 hover:bg-brand-green-light/40'
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  selected
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'
                }`}
              />

              <span className="text-sm font-semibold">
                {event.label}
              </span>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}