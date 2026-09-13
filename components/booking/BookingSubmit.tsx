import { Loader2, MessageCircle } from 'lucide-react'

interface BookingSubmitProps {
  isSubmitting: boolean
  disabled?: boolean
  onClick: () => void
}

export function BookingSubmit({
  isSubmitting,
  disabled,
  onClick,
}: BookingSubmitProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending request...
        </>
      ) : (
        <>
          <MessageCircle className="h-4 w-4" />
          Request Catering
        </>
      )}
    </button>
  )
}