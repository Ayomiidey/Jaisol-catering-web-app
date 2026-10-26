import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const DELIVERY_FEE = 2.5

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

    const { items, deliveryAddress, phone, notes, allergies } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain items' },
        { status: 400 }
      )
    }

    if (
      typeof deliveryAddress !== 'string' ||
      typeof phone !== 'string' ||
      !deliveryAddress.trim() ||
      !phone.trim()
    ) {
      return NextResponse.json(
        { error: 'Delivery address and phone are required' },
        { status: 400 }
      )
    }

    const validItems = items.every(
      (item: { menuItemId?: unknown; quantity?: unknown }) =>
        typeof item.menuItemId === 'string' &&
        Number.isInteger(item.quantity) &&
        Number(item.quantity) > 0
    )

    if (!validItems) {
      return NextResponse.json(
        { error: 'Order contains invalid items' },
        { status: 400 }
      )
    }

    if (allergies !== undefined && typeof allergies !== 'string') {
      return NextResponse.json({ error: 'Allergy information must be text' }, { status: 400 })
    }
    if (typeof allergies === 'string' && allergies.length > 1000) {
      return NextResponse.json({ error: 'Allergy information must be 1000 characters or fewer' }, { status: 400 })
    }

    const menuItemIds = [...new Set(items.map((item: { menuItemId: string }) => item.menuItemId))]
    const menuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
      select: { id: true, price: true },
    })
    const menuItemById = new Map(menuItems.map((item) => [item.id, item]))

    if (menuItemById.size !== menuItemIds.length) {
      return NextResponse.json(
        { error: 'One or more items are no longer available. Please refresh your cart.' },
        { status: 400 }
      )
    }

    const subtotal = items.reduce(
      (sum: number, item: { menuItemId: string; quantity: number }) =>
        sum + menuItemById.get(item.menuItemId)!.price * item.quantity,
      0
    )

    const order = await db.order.create({
      data: {
        userId,
        status: 'awaiting_whatsapp_confirmation',
        totalPrice: subtotal + DELIVERY_FEE,
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        notes: typeof notes === 'string' ? notes.trim() : '',
        allergies: typeof allergies === 'string' && allergies.trim() ? allergies.trim() : null,
        items: {
          create: items.map((item: { menuItemId: string; quantity: number; notes?: string }) => ({
            quantity: item.quantity,
            priceAtPurchase: menuItemById.get(item.menuItemId)!.price,
            notes: typeof item.notes === 'string' ? item.notes.trim() : '',
            menuItem: { connect: { id: item.menuItemId } },
          })),
        },
      },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            priceAtPurchase: true,
            menuItem: { select: { name: true } },
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          status: order.status,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          items: order.items,
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
