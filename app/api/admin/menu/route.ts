import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await db.menuItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Admin menu error:', error)
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, category, imageUrl, images } = body
    const imageList = Array.isArray(images)
      ? images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0).map((image) => image.trim())
      : []
    const primaryImage = imageUrl ? String(imageUrl).trim() : imageList[0] ?? null

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 })
    }

    const item = await db.menuItem.create({
      data: {
        name: String(name).trim(),
        description: description ? String(description).trim() : null,
        price: Number(price),
        category: String(category).trim(),
        imageUrl: primaryImage,
        images: Array.from(new Set(primaryImage ? [primaryImage, ...imageList] : imageList)),
        isAvailable: true,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Create menu item error:', error)
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}
