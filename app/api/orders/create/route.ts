import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in before placing an order' },
        { status: 401 }
      )
    }

    const { items, totalPrice, deliveryAddress, phone, notes } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain items' },
        { status: 400 }
      )
    }

    if (!deliveryAddress || !phone) {
      return NextResponse.json(
        { error: 'Delivery address and phone are required' },
        { status: 400 }
      )
    }

    const order = await db.order.create({
      data: {
        userId,
        status: 'pending',
        totalPrice,
        deliveryAddress,
        phone,
        notes,
      },
    })

    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          notes: item.notes || '',
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          status: order.status,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
