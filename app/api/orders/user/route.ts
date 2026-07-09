import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedOrders = orders.map((order) => {
      const itemNames = order.items.map((item) => item.menuItem.name)
      const createdDate = new Date(order.createdAt)
      const dateStr = createdDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })

      return {
        id: order.id,
        items: itemNames,
        date: dateStr,
        amount: order.totalPrice,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
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
