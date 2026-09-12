'use client'

import { MapPin, Phone, MessageSquare } from 'lucide-react'

interface DeliveryFormProps {
  deliveryAddress: string
  phone: string
  notes: string
  errors: {
    address?: string
    phone?: string
    cart?: string
  }
  onAddressChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onNotesChange: (value: string) => void
}

export function DeliveryForm({
  deliveryAddress,
  phone,
  notes,
  errors,
  onAddressChange,
  onPhoneChange,
  onNotesChange,
}: DeliveryFormProps) {
  return (
    <section className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Delivery Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Where should we deliver your order?
        </p>
      </div>

      <div className="space-y-5">
        {/* Address */}
        <div>
          <label
            htmlFor="delivery-address"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <MapPin className="h-4 w-4 text-primary" />
            Delivery address
          </label>

          <textarea
            id="delivery-address"
            value={deliveryAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Enter your full delivery address"
            rows={3}
            className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {errors.address && (
            <p className="mt-1 text-sm text-destructive">
              {errors.address}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <Phone className="h-4 w-4 text-primary" />
            Phone number
          </label>

          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-destructive">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            Special instructions
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Any delivery instructions?"
            rows={3}
            className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </section>
  )
}