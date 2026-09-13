export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export interface AdminBooking {
  id: string
  eventType: string
  guestCount: number
  date: string
  eventTime?: string | null
  location: string
  phone?: string | null
  dietaryNeeds?: string | null
  notes?: string | null
  status: BookingStatus
  estimatedCost?: number | null
  createdAt: string
  user: {
    name?: string | null
    email?: string | null
  }
}