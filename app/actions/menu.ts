'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getMenuItems(category?: string) {
  try {
    const where = category ? { category, isAvailable: true } : { isAvailable: true }

    const items = await db.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return items
  } catch (error) {
    console.error('Error fetching menu items:', error)
    throw new Error('Failed to fetch menu items')
  }
}

export async function getMenuItemById(id: string) {
  try {
    const item = await db.menuItem.findUnique({
      where: { id },
    })

    if (!item) {
      throw new Error('Menu item not found')
    }

    return item
  } catch (error) {
    console.error('Error fetching menu item:', error)
    throw new Error('Failed to fetch menu item')
  }
}

export async function createMenuItem(data: {
  name: string
  description?: string
  price: number
  category: string
  imageUrl?: string
}) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const item = await db.menuItem.create({
      data,
    })

    return item
  } catch (error) {
    console.error('Error creating menu item:', error)
    throw new Error('Failed to create menu item')
  }
}

export async function updateMenuItem(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    category?: string
    imageUrl?: string
    isAvailable?: boolean
  }
) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const item = await db.menuItem.update({
      where: { id },
      data,
    })

    return item
  } catch (error) {
    console.error('Error updating menu item:', error)
    throw new Error('Failed to update menu item')
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    await db.menuItem.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting menu item:', error)
    throw new Error('Failed to delete menu item')
  }
}

export async function seedMenuItems() {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const items = [
      {
        name: 'Jollof Rice',
        description: 'Party-style, smoky jollof rice',
        price: 12.99,
        category: 'Mains',
        imageUrl: '/images/jollof-rice.png',
      },
      {
        name: 'Puff Puff',
        description: '12 pcs, glazed & dusted',
        price: 9.99,
        category: 'Pastries',
        imageUrl: '/images/puff-puff.png',
      },
      {
        name: 'Fullhouse Box',
        description: 'Rice + protein + side',
        price: 18.99,
        category: 'Mains',
        imageUrl: '/images/fullhouse-box.png',
      },
      {
        name: 'Grilled Lamb',
        description: 'Tender grilled lamb skewers',
        price: 14.99,
        category: 'Mains',
        imageUrl: '/images/grilled-lamb.png',
      },
      {
        name: 'Egusi Soup',
        description: 'Traditional egusi soup with fufu',
        price: 13.99,
        category: 'Mains',
        imageUrl: '/images/egusi-soup.png',
      },
      {
        name: 'Mini Cakes',
        description: 'Assorted mini cake collection',
        price: 8.99,
        category: 'Cakes',
        imageUrl: '/images/mini-cakes.png',
      },
      {
        name: 'Wedding Cake',
        description: 'Custom design - Herefordshire 2024',
        price: 0, // To be quoted
        category: 'Cakes',
        imageUrl: '/images/wedding-cake.png',
      },
      {
        name: 'Soya Skewers',
        description: 'Marinated soya protein skewers',
        price: 7.99,
        category: 'Starters',
        imageUrl: '/images/soya-skewers.png',
      },
    ]

    // Check if items already exist
    const existingCount = await db.menuItem.count()
    if (existingCount > 0) {
      return { message: 'Menu items already seeded' }
    }

    const created = await db.menuItem.createMany({
      data: items,
    })

    return { message: `Created ${created.count} menu items` }
  } catch (error) {
    console.error('Error seeding menu items:', error)
    throw new Error('Failed to seed menu items')
  }
}
