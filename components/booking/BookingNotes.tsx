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
    <div className="space-y-2">
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
      />
    </div>
  )
}