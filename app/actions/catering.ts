'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createCateringBooking(data: {
  eventType: string
  guestCount: number
  date: string
  location: string
  dietaryNeeds?: string[]
  notes?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const booking = await db.cateringBooking.create({
      data: {
        userId: session.user.id,
        eventType: data.eventType,
        guestCount: data.guestCount,
        date: new Date(data.date),
        location: data.location,
        dietaryNeeds: data.dietaryNeeds ? JSON.stringify(data.dietaryNeeds) : null,
        notes: data.notes,
        status: 'pending',
        estimatedCost: data.guestCount * 15,
      },
    })

    revalidatePath('/book')
    return booking
  } catch (error) {
    console.error('Error creating catering booking:', error)
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
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return bookings.map((b) => ({
      ...b,
      dietaryNeeds: b.dietaryNeeds ? JSON.parse(b.dietaryNeeds) : [],
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
      where: { id, userId: session.user.id },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    return {
      ...booking,
      dietaryNeeds: booking.dietaryNeeds ? JSON.parse(booking.dietaryNeeds) : [],
    }
  } catch (error) {
    console.error('Error fetching booking:', error)
    throw new Error('Failed to fetch booking')
  }
}

export async function getAllBookings(filters?: { status?: string; limit?: number }) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const bookings = await db.cateringBooking.findMany({
      where: filters?.status ? { status: filters.status } : {},
      include: { user: true },
      orderBy: { date: 'asc' },
      take: filters?.limit || 50,
    })

    return bookings.map((b) => ({
      ...b,
      dietaryNeeds: b.dietaryNeeds ? JSON.parse(b.dietaryNeeds) : [],
    }))
  } catch (error) {
    console.error('Error fetching all bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const booking = await db.cateringBooking.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/admin/bookings')
    return booking
  } catch (error) {
    console.error('Error updating booking:', error)
    throw new Error('Failed to update booking')
  }
}

export async function updateBookingCost(id: string, estimatedCost: number) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const booking = await db.cateringBooking.update({
      where: { id },
      data: { estimatedCost },
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
      orderBy: { createdAt: 'desc' },
    })

    return packages.map((p) => ({
      ...p,
      includes: p.includes ? JSON.parse(p.includes) : [],
    }))
  } catch (error) {
    console.error('Error fetching catering packages:', error)
    throw new Error('Failed to fetch packages')
  }
}
