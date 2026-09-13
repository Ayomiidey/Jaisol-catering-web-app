import { MessageCircle, Phone, Mail, User } from "lucide-react"

import { AdminBooking } from "@/types/catering"

interface BookingContactProps {
  booking: AdminBooking
}

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "")

  if (digits.startsWith("0")) {
    return `44${digits.slice(1)}`
  }

  return digits
}

export function BookingContact({
  booking,
}: BookingContactProps) {
  const whatsappNumber = booking.phone
    ? getWhatsAppNumber(booking.phone)
    : null

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 font-semibold">
        Customer Contact
      </h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Name
            </p>

            <p className="text-sm">
              {booking.user.name || "Not available"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Email
            </p>

            <p className="break-all text-sm">
              {booking.user.email || "Not available"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Phone
            </p>

            <p className="text-sm">
              {booking.phone || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          Open WhatsApp
        </a>
      )}
    </div>
  )
}