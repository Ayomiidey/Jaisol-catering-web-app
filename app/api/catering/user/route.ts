import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    const bookings = await db.cateringBooking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      bookings.map((booking) => ({
        id: booking.id,
        event: `${booking.eventType} - ${booking.guestCount} guests`,
        date: booking.date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
        location: booking.location,
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      })),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
