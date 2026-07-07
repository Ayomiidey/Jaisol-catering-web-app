import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
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

    // Create order
    const order = await db.order.create({
      data: {
        userId: 'guest-user', // In production, get from session
        status: 'pending',
        totalPrice,
        deliveryAddress,
        phone,
        notes,
      },
    })

    // Create order items
    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.id,
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
