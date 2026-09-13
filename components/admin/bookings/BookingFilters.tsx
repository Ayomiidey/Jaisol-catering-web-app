import { BOOKING_STATUSES, BookingStatus } from "@/types/catering"

interface BookingFiltersProps {
  value: BookingStatus | ""
  onChange: (status: BookingStatus | "") => void
}

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
}

export function BookingFilters({
  value,
  onChange,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          value === ""
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80"
        }`}
      >
        All
      </button>

      {BOOKING_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            value === status
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          {statusLabels[status]}
        </button>
      ))}
    </div>
  )
}