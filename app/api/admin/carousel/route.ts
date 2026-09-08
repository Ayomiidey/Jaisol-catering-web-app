import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

async function isAdmin() {
  const session = await auth()
  return Boolean(session?.user && (session.user as { isAdmin?: boolean }).isAdmin)
}

function readSlide(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : ''
  if (!title || !imageUrl) throw new Error('Title and image are required')
  return {
    title,
    imageUrl,
    description: typeof body.description === 'string' ? body.description.trim() || null : null,
    link: typeof body.link === 'string' ? body.link.trim() || null : null,
    type: typeof body.type === 'string' ? body.type : 'homepage',
    sortOrder: Number.isInteger(body.sortOrder) ? body.sortOrder as number : 0,
    isActive: body.isActive !== false,
  }
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const slides = await db.carousel.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  return NextResponse.json({ data: slides })
}

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const slide = await db.carousel.create({ data: readSlide(await request.json()) })
    return NextResponse.json({ data: slide }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create slide' }, { status: 400 })
  }
}
