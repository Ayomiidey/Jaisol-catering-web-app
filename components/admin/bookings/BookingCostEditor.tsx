import { useState } from "react"

interface BookingCostEditorProps {
  currentCost?: number | null
  onSave: (cost: number) => void
  isUpdating: boolean
}

export function BookingCostEditor({
  currentCost,
  onSave,
  isUpdating,
}: BookingCostEditorProps) {
  const [value, setValue] = useState(
    currentCost != null ? String(currentCost) : ""
  )

  function handleSave() {
    const cost = Number(value)

    if (!Number.isFinite(cost) || cost < 0) {
      return
    }

    onSave(cost)
  }

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        Quoted Price
      </p>

      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 1200"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!value || isUpdating}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  )
}