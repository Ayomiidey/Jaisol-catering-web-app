import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await req.json()

    const { status, estimatedCost } = body

    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const data: {
      status?: string
      estimatedCost?: number | null
    } = {}

    if (status !== undefined) {
      data.status = status
    }

    if (estimatedCost !== undefined) {
      if (estimatedCost === null || estimatedCost === '') {
        data.estimatedCost = null
      } else {
        const parsedCost = Number(estimatedCost)

        if (
          !Number.isFinite(parsedCost) ||
          parsedCost < 0
        ) {
          return NextResponse.json(
            { error: 'Invalid estimated cost' },
            { status: 400 }
          )
        }

        data.estimatedCost = parsedCost
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No update supplied' },
        { status: 400 }
      )
    }

    const booking = await db.cateringBooking.update({
      where: {
        id,
      },
      data,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Update booking error:', error)

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}