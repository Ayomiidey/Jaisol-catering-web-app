import {
  BOOKING_STATUSES,
  BookingStatus,
} from "@/types/catering"

interface BookingStatusEditorProps {
  currentStatus: BookingStatus
  onChange: (status: BookingStatus) => void
  isUpdating: boolean
}

export function BookingStatusEditor({
  currentStatus,
  onChange,
  isUpdating,
}: BookingStatusEditorProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        Booking Status
      </p>

      <div className="flex flex-wrap gap-2">
        {BOOKING_STATUSES.map((status) => {
          const active = currentStatus === status

          return (
            <button
              key={status}
              type="button"
              disabled={active || isUpdating}
              onClick={() => onChange(status)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary hover:border-primary hover:bg-primary/10"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {status}
            </button>
          )
        })}
      </div>
    </div>
  )
}