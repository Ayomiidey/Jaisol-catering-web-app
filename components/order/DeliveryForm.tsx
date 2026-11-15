'use client'

import { CalendarDays, MapPin, Phone, MessageSquare } from 'lucide-react'
import { formatOrderDate } from '@/lib/order-schedule'

interface DeliveryFormProps {
  deliveryAddress: string
  phone: string
  notes: string
  allergies: string
  isTodayAvailable: boolean
  today: string
  deliveryDate: string
  availableDates: string[]
  errors: {
    address?: string
    phone?: string
    cart?: string
    deliveryDate?: string
  }
  onAddressChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onNotesChange: (value: string) => void
  onAllergiesChange: (value: string) => void
  onDeliveryDateChange: (value: string) => void
}

export function DeliveryForm({
  deliveryAddress,
  phone,
  notes,
  allergies,
  isTodayAvailable,
  today,
  deliveryDate,
  availableDates,
  errors,
  onAddressChange,
  onPhoneChange,
  onNotesChange,
  onAllergiesChange,
  onDeliveryDateChange,
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
        <div className={`rounded-xl border p-4 ${isTodayAvailable ? 'border-primary/20 bg-primary/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
          <div className="flex items-start gap-3">
            <CalendarDays className={`mt-0.5 h-5 w-5 shrink-0 ${isTodayAvailable ? 'text-primary' : 'text-amber-700 dark:text-amber-400'}`} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {isTodayAvailable ? 'Orders are being prepared today' : 'Choose a preparation and delivery date'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isTodayAvailable
                  ? `Today is ${formatOrderDate(today)}. Your order will be scheduled for today.`
                  : 'Our chef prepares orders Thursday to Saturday. Today is not an available preparation day, so your order will be scheduled for the date you choose below.'}
              </p>
            </div>
          </div>
          {!isTodayAvailable && (
            <div className="mt-4">
              <label htmlFor="order-delivery-date" className="mb-2 block text-sm font-medium">
                Available delivery dates <span className="text-destructive">*</span>
              </label>
              <select
                id="order-delivery-date"
                value={deliveryDate}
                onChange={(event) => onDeliveryDateChange(event.target.value)}
                required
                aria-invalid={Boolean(errors.deliveryDate)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Choose a Thursday, Friday, or Saturday</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>{formatOrderDate(date)}</option>
                ))}
              </select>
              {errors.deliveryDate && (
                <p className="mt-1 text-sm text-destructive">{errors.deliveryDate}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Your order will be prepared and delivered on the date selected. It will not be scheduled for today.
              </p>
            </div>
          )}
        </div>

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

        {/* Allergies */}
        <div>
          <label htmlFor="allergies" className="mb-2 flex items-center gap-2 text-sm font-medium">
            Allergies or food sensitivities
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="allergies"
            value={allergies}
            onChange={(event) => onAllergiesChange(event.target.value)}
            placeholder="Let us know about any allergies we should be aware of"
            maxLength={1000}
            rows={3}
            className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-muted-foreground">We’ll include this with your order details so our team can review it.</p>
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
