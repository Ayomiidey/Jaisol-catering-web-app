import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const type = new URL(request.url).searchParams.get('type') || 'homepage'
    const now = new Date()
    const slides = await db.carousel.findMany({
      where: {
        type,
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ data: slides })
  } catch (error) {
    console.error('Fetch carousel slides error:', error)
    return NextResponse.json({ error: 'Failed to fetch carousel slides' }, { status: 500 })
  }
}
