import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      pendingOrdersCount,
      pendingBookingsCount,
      totalOrdersCount,
      totalBookingsCount,
      monthlyOrders,
      allTimeRevenue,
      recentOrders,
      recentBookings,
    ] = await Promise.all([
      db.order.count({ where: { status: 'pending' } }),
      db.cateringBooking.count({ where: { status: 'pending' } }),
      db.order.count(),
      db.cateringBooking.count(),
      db.order.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { totalPrice: true },
      }),
      db.order.aggregate({ _sum: { totalPrice: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          totalPrice: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
          items: {
            select: {
              quantity: true,
              menuItem: { select: { name: true } },
            },
          },
        },
      }),
      db.cateringBooking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          eventType: true,
          guestCount: true,
          date: true,
          location: true,
          estimatedCost: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ])

    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalPrice, 0)

    return NextResponse.json({
      pendingOrders: pendingOrdersCount,
      pendingBookings: pendingBookingsCount,
      totalOrders: totalOrdersCount,
      totalBookings: totalBookingsCount,
      monthlyRevenue,
      totalRevenue: allTimeRevenue._sum.totalPrice ?? 0,
      recentOrders,
      recentBookings,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
