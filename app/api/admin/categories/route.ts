import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

async function requireAdmin() {
  const session = await auth()
  return Boolean(session?.user?.isAdmin)
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [categories, itemCounts] = await Promise.all([
      db.foodCategory.findMany({ orderBy: { name: 'asc' } }),
      db.menuItem.groupBy({ by: ['category'], _count: { _all: true } }),
    ])
    const knownNames = new Set(categories.map((category) => category.name.toLocaleLowerCase()))
    const results = [
      ...categories.map((category) => ({ id: category.id, name: category.name, itemCount: itemCounts.find((entry) => entry.category.toLocaleLowerCase() === category.name.toLocaleLowerCase())?._count._all ?? 0 })),
      ...itemCounts.filter((entry) => !knownNames.has(entry.category.toLocaleLowerCase())).map((entry) => ({ id: null, name: entry.category, itemCount: entry._count._all })),
    ]
    return NextResponse.json(results.sort((a, b) => a.name.localeCompare(b.name)))
  } catch (error) {
    console.error('Admin categories error:', error)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
    if (!name || name.length > 100) return NextResponse.json({ error: 'Enter a category name up to 100 characters long.' }, { status: 400 })

    const [existing, existingMenuCategory] = await Promise.all([
      db.foodCategory.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } }),
      db.menuItem.findFirst({ where: { category: { equals: name, mode: 'insensitive' } }, select: { id: true } }),
    ])
    if (existing || existingMenuCategory) return NextResponse.json({ error: 'That category already exists.' }, { status: 409 })

    const category = await db.foodCategory.create({ data: { name } })
    return NextResponse.json({ id: category.id, name: category.name, itemCount: 0 }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
