'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type {
  Prisma,
  CateringBooking,
  CateringPackage,
} from '@prisma/client'

type CateringBookingWithUser = Prisma.CateringBookingGetPayload<{
  include: { user: true }
}>

function parseJsonArray(value: string | null): string[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizePhone(phone: string): string {
  return phone.trim().replace(/\s+/g, ' ')
}

export async function createCateringBooking(data: {
  eventType: string
  guestCount: number
  date: string
  location: string
  phone: string
  dietaryNeeds?: string[]
  notes?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    if (!data.eventType?.trim()) {
      throw new Error('Event type is required')
    }

    if (
      !Number.isInteger(data.guestCount) ||
      data.guestCount < 20 ||
      data.guestCount > 500
    ) {
      throw new Error('Guest count must be between 20 and 500')
    }

    if (!data.date) {
      throw new Error('Event date and time are required')
    }

    if (!data.location?.trim() || data.location.trim().length < 3) {
      throw new Error('A valid event location is required')
    }

    if (!data.phone?.trim()) {
      throw new Error('Phone number is required')
    }

    const eventDate = new Date(data.date)

    if (Number.isNaN(eventDate.getTime())) {
      throw new Error('Invalid event date')
    }

    if (eventDate.getTime() <= Date.now()) {
      throw new Error('Event date must be in the future')
    }

    const booking = await db.cateringBooking.create({
      data: {
        userId: session.user.id,

        eventType: data.eventType.trim(),

        guestCount: data.guestCount,

        date: eventDate,

        location: data.location.trim(),

        phone: normalizePhone(data.phone),

        dietaryNeeds:
          data.dietaryNeeds && data.dietaryNeeds.length > 0
            ? JSON.stringify(data.dietaryNeeds)
            : null,

        notes: data.notes?.trim() || null,

        status: 'pending',

        // Final pricing is discussed through WhatsApp.
        estimatedCost: null,
      },
    })

    revalidatePath('/book')
    revalidatePath('/admin/bookings')

    return booking
  } catch (error) {
    console.error('Error creating catering booking:', error)

    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Failed to create booking')
  }
}

export async function getUserBookings() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const bookings = await db.cateringBooking.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return bookings.map((booking: CateringBooking) => ({
      ...booking,
      dietaryNeeds: parseJsonArray(booking.dietaryNeeds),
    }))
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}

export async function getBookingById(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const booking = await db.cateringBooking.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    return {
      ...booking,
      dietaryNeeds: parseJsonArray(booking.dietaryNeeds),
    }
  } catch (error) {
    console.error('Error fetching booking:', error)
    throw new Error('Failed to fetch booking')
  }
}

export async function getAllBookings(filters?: {
  status?: string
  limit?: number
}) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const bookings = await db.cateringBooking.findMany({
      where: filters?.status
        ? {
            status: filters.status,
          }
        : {},

      include: {
        user: true,
      },

      orderBy: {
        date: 'asc',
      },

      take: filters?.limit || 50,
    })

    return bookings.map((booking: CateringBookingWithUser) => ({
      ...booking,
      dietaryNeeds: parseJsonArray(booking.dietaryNeeds),
    }))
  } catch (error) {
    console.error('Error fetching all bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}

export async function updateBookingStatus(
  id: string,
  status: string
) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const validStatuses = [
      'pending',
      'confirmed',
      'cancelled',
      'completed',
    ]

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid booking status')
    }

    const booking = await db.cateringBooking.update({
      where: {
        id,
      },

      data: {
        status,
      },
    })

    revalidatePath('/admin/bookings')

    return booking
  } catch (error) {
    console.error('Error updating booking:', error)
    throw new Error('Failed to update booking')
  }
}

export async function updateBookingCost(
  id: string,
  estimatedCost: number
) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      throw new Error('Invalid estimated cost')
    }

    const booking = await db.cateringBooking.update({
      where: {
        id,
      },

      data: {
        estimatedCost,
      },
    })

    revalidatePath('/admin/bookings')

    return booking
  } catch (error) {
    console.error('Error updating booking cost:', error)
    throw new Error('Failed to update booking cost')
  }
}

export async function getCateringPackages() {
  try {
    const packages = await db.cateringPackage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return packages.map((packageItem: CateringPackage) => ({
      ...packageItem,
      includes: packageItem.includes
        ? JSON.parse(packageItem.includes)
        : [],
    }))
  } catch (error) {
    console.error('Error fetching catering packages:', error)
    throw new Error('Failed to fetch packages')
  }
}