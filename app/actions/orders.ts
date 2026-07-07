'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: {
  items: Array<{ menuItemId: string; quantity: number; priceAtPurchase: number }>
  totalPrice: number
  deliveryAddress: string
  phone: string
  notes?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        totalPrice: data.totalPrice,
        deliveryAddress: data.deliveryAddress,
        phone: data.phone,
        notes: data.notes,
        status: 'pending',
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: { items: true },
    })

    revalidatePath('/order')
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

export async function getUserOrders() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return orders
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export async function getOrderById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const order = await db.order.findFirst({
      where: { id, userId: session.user.id },
      include: { items: { include: { menuItem: true } } },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Failed to fetch order')
  }
}

export async function getAllOrders(filters?: { status?: string; limit?: number }) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const orders = await db.order.findMany({
      where: filters?.status ? { status: filters.status } : {},
      include: { items: { include: { menuItem: true } }, user: true },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    })

    return orders
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      throw new Error('Unauthorized')
    }

    const order = await db.order.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/admin/orders')
    return order
  } catch (error) {
    console.error('Error updating order:', error)
    throw new Error('Failed to update order')
  }
}
