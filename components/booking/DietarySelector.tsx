const DIETARY_OPTIONS = [
  'Halal',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
]

interface DietarySelectorProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function DietarySelector({
  value,
  onChange,
}: DietarySelectorProps) {
  function toggleOption(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
      return
    }

    onChange([...value, option])
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Requirements
        </p>

        <h2 className="mt-1 text-xl font-bold">
          Dietary preferences
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Select any preferences you already know about.
          Specific allergies or detailed requirements can be
          discussed with us on WhatsApp.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => {
          const selected = value.includes(option)

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-brand-green-light'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </section>
  )
}