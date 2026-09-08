import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, description, price, category, imageUrl, images, isAvailable } = body

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = String(name).trim()
    if (description !== undefined) data.description = description ? String(description).trim() : null
    if (price !== undefined) data.price = Number(price)
    if (category !== undefined) data.category = String(category).trim()
    if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl).trim() : null
    if (images !== undefined) {
      if (!Array.isArray(images) || images.some((image) => typeof image !== 'string')) {
        return NextResponse.json({ error: 'Images must be a list of URLs' }, { status: 400 })
      }
      data.images = Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)))
    }
    if (isAvailable !== undefined) data.isAvailable = Boolean(isAvailable)

    const item = await db.menuItem.update({
      where: { id },
      data,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Update menu item error:', error)
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db.menuItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete menu item error:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { error: 'This menu item is part of an existing order and cannot be deleted. Hide it instead to preserve order history.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
