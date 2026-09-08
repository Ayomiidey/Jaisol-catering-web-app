import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

async function isAdmin() {
  const session = await auth()
  return Boolean(session?.user && (session.user as { isAdmin?: boolean }).isAdmin)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const data: Record<string, unknown> = {}
    for (const field of ['title', 'description', 'imageUrl', 'link', 'type']) {
      if (field in body) data[field] = typeof body[field] === 'string' ? body[field].trim() || null : body[field]
    }
    if (typeof data.title !== 'undefined' && !data.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    if (typeof data.imageUrl !== 'undefined' && !data.imageUrl) return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    if (typeof body.sortOrder === 'number') data.sortOrder = Math.trunc(body.sortOrder)
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive
    const slide = await db.carousel.update({ where: { id }, data })
    return NextResponse.json({ data: slide })
  } catch {
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await db.carousel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 400 })
  }
}
