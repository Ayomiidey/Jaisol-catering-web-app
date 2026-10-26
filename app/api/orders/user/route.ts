import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db.order.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        deliveryAddress: true,
        phone: true,
        notes: true,
        items: {
          select: {
            menuItemId: true,
            quantity: true,
            priceAtPurchase: true,
            notes: true,
            menuItem: { select: { id: true, name: true, price: true, imageUrl: true, isAvailable: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const formattedOrders = orders.map((order) => {
      return {
        id: order.id,
        items: order.items,
        date: order.createdAt.toISOString(),
        amount: order.totalPrice,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        phone: order.phone,
        notes: order.notes,
      }
    })

    return NextResponse.json(formattedOrders, { status: 200 })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
