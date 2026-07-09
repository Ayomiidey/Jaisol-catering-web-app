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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      totalBookings,
      monthBookings,
      topItems,
      eventTypes,
    ] = await Promise.all([
      db.order.aggregate({ _sum: { totalPrice: true } }),
      db.order.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { totalPrice: true },
        _count: true,
      }),
      db.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { totalPrice: true },
        _count: true,
      }),
      db.order.count(),
      db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.cateringBooking.count(),
      db.cateringBooking.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.orderItem.groupBy({
        by: ['menuItemId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      db.cateringBooking.groupBy({
        by: ['eventType'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ])

    // Fetch menu item names for top items
    const menuItemIds = topItems.map((t) => t.menuItemId)
    const menuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true },
    })
    const menuItemMap = Object.fromEntries(menuItems.map((m) => [m.id, m.name]))

    const topItemsWithNames = topItems.map((t) => ({
      name: menuItemMap[t.menuItemId] ?? 'Unknown',
      count: t._sum.quantity ?? 0,
    }))

    const totalRev = totalRevenue._sum.totalPrice ?? 0
    const monthRev = monthRevenue._sum.totalPrice ?? 0
    const lastMonthRev = lastMonthRevenue._sum.totalPrice ?? 0
    const monthOrderCount = monthRevenue._count
    const lastMonthOrderCount = lastMonthRevenue._count

    const revenueGrowth =
      lastMonthRev > 0 ? (((monthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1) : null

    const ordersGrowth =
      lastMonthOrderCount > 0
        ? (((monthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100).toFixed(1)
        : null

    const avgOrderValue = totalOrders > 0 ? totalRev / totalOrders : 0

    return NextResponse.json({
      totalRevenue: totalRev,
      monthlyRevenue: monthRev,
      revenueGrowth,
      totalOrders,
      monthlyOrders: monthOrderCount,
      ordersGrowth,
      avgOrderValue,
      totalBookings,
      monthlyBookings: monthBookings,
      topItems: topItemsWithNames,
      eventTypes: eventTypes.map((e) => ({ name: e.eventType, count: e._count.id })),
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
