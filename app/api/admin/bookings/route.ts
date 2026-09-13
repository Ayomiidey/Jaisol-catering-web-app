import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (
      !session?.user ||
      !(session.user as any).isAdmin
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')

    const requestedLimit = Number(
      searchParams.get('limit') || '50'
    )

    const limit =
      Number.isFinite(requestedLimit) &&
      requestedLimit > 0 &&
      requestedLimit <= 100
        ? Math.floor(requestedLimit)
        : 50

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid status filter' },
        { status: 400 }
      )
    }

    const bookings = await db.cateringBooking.findMany({
      where: status
        ? {
            status,
          }
        : {},

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: [
        {
          date: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],

      take: limit,
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Admin bookings error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}