import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let itemsCreated = 0
    let packagesCreated = 0

    // This endpoint is safe to call repeatedly. It only adds demo data to empty tables.
    if (await db.menuItem.count() === 0) {
      const result = await db.menuItem.createMany({ data: [
        { name: 'Jollof Rice', description: 'Party-style smoky jollof rice', price: 12.99, category: 'Mains', imageUrl: '/images/jollof-rice.png', isAvailable: true },
        { name: 'Puff Puff', description: '12 pcs glazed & dusted', price: 9.99, category: 'Pastries', imageUrl: '/images/puff-puff.png', isAvailable: true },
        { name: 'Fullhouse Box', description: 'Rice + protein + side', price: 18, category: 'Mains', imageUrl: '/images/fullhouse-box.png', isAvailable: true },
        { name: 'Grilled Lamb', description: 'Marinated West African style', price: 15.99, category: 'Starters', imageUrl: '/images/grilled-lamb.png', isAvailable: true },
        { name: 'Egusi Soup', description: 'With fufu, rich melon seed broth', price: 11.99, category: 'Mains', imageUrl: '/images/egusi-soup.png', isAvailable: true },
        { name: 'Mini Cakes', description: 'Assorted decorated mini cakes', price: 14.99, category: 'Pastries', imageUrl: '/images/mini-cakes.png', isAvailable: true },
        { name: 'Wedding Cake', description: 'Multi-tiered elegant cake', price: 89.99, category: 'Pastries', imageUrl: '/images/wedding-cake.png', isAvailable: true },
        { name: 'Soya Skewers', description: 'Grilled vegetarian starter', price: 13.99, category: 'Starters', imageUrl: '/images/soya-skewers.png', isAvailable: true },
      ] })
      itemsCreated = result.count
    }

    if (await db.cateringPackage.count() === 0) {
      const result = await db.cateringPackage.createMany({ data: [
        { name: 'Basic Package', description: 'Perfect for small gatherings', pricePerPerson: 15, minGuests: 20, includes: JSON.stringify(['Jollof Rice', 'Grilled Meat', 'Salad', 'Drinks']) },
        { name: 'Premium Package', description: 'Complete catering experience', pricePerPerson: 25, minGuests: 30, includes: JSON.stringify(['Multiple Mains', 'Starters', 'Desserts', 'Beverages', 'Service']) },
        { name: 'Deluxe Package', description: 'All-inclusive celebration', pricePerPerson: 35, minGuests: 50, includes: JSON.stringify(['Premium Mains', 'Multiple Starters', 'Cake', 'Full Beverages', 'Server Staff', 'Setup & Cleanup']) },
      ] })
      packagesCreated = result.count
    }

    return NextResponse.json({
      success: true,
      message: itemsCreated || packagesCreated ? 'Demo data added to empty tables.' : 'Existing menu items and packages were preserved; nothing needed seeding.',
      itemsCreated,
      packagesCreated,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: 'Failed to seed empty tables' }, { status: 500 })
  }
}
