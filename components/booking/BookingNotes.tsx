"use client"

import { Textarea } from "@/components/ui/textarea"

interface BookingNotesProps {
  value: string
  onChange: (value: string) => void
}

export function BookingNotes({
  value,
  onChange,
}: BookingNotesProps) {
  return (
    <section className="min-w-0 space-y-3 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div>
        <label
          htmlFor="notes"
          className="text-sm font-medium"
        >
          Additional Notes
        </label>

        <p className="text-xs text-muted-foreground">
          Optional. Packages, menu choices, allergies,
          dietary requirements and final pricing can be
          discussed on WhatsApp.
        </p>
      </div>

      <Textarea
        id="notes"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Anything else you'd like us to know?"
        rows={5}
        maxLength={1000}
        className="min-h-32 w-full resize-y"
      />
      <p className="text-right text-xs text-muted-foreground" aria-live="polite">
        {value.length}/1,000 characters
      </p>
    </section>
  )
}
