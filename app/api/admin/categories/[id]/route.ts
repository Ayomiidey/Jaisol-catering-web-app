import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const category = await db.foodCategory.findUnique({ where: { id } })
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    const itemCount = await db.menuItem.count({ where: { category: { equals: category.name, mode: 'insensitive' } } })
    if (itemCount > 0) return NextResponse.json({ error: 'Move or remove the menu items in this category before deleting it.' }, { status: 409 })
    await db.foodCategory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
