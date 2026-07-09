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
      monthlyOrders,
      allTimeRevenue,
      recentOrders,
    ] = await Promise.all([
      db.order.count({ where: { status: 'pending' } }),
      db.cateringBooking.count({ where: { status: 'pending' } }),
      db.order.count(),
      db.order.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { totalPrice: true },
      }),
      db.order.aggregate({ _sum: { totalPrice: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: { include: { menuItem: true } } },
      }),
    ])

    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalPrice, 0)

    return NextResponse.json({
      pendingOrders: pendingOrdersCount,
      pendingBookings: pendingBookingsCount,
      totalOrders: totalOrdersCount,
      monthlyRevenue,
      totalRevenue: allTimeRevenue._sum.totalPrice ?? 0,
      recentOrders,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
