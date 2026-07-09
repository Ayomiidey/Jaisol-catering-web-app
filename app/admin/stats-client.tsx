'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'

interface Stats {
  pendingOrders: number
  pendingBookings: number
  totalOrders: number
  monthlyRevenue: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    status: string
    totalPrice: number
    createdAt: string
    user: { name: string }
    items: Array<{ menuItem: { name: string }; quantity: number }>
  }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  making: 'bg-orange-500/20 text-orange-400',
  ready: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

export function AdminDashboardStats() {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-muted-foreground text-xs mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-orange-500">{data.pendingOrders}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-muted-foreground text-xs mb-1">Pending Bookings</p>
          <p className="text-3xl font-bold text-orange-500">{data.pendingBookings}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-muted-foreground text-xs mb-1">This Month</p>
          <p className="text-3xl font-bold text-orange-500">£{data.monthlyRevenue.toFixed(0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-muted-foreground text-xs mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-orange-500">{data.totalOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      {data.recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-orange-500 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            {data.recentOrders.map((order, idx) => (
              <div
                key={order.id}
                className={`flex items-center justify-between p-4 ${idx < data.recentOrders.length - 1 ? 'border-b border-border' : ''} hover:bg-secondary/50 transition`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{order.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="font-semibold text-sm text-orange-500">£{order.totalPrice.toFixed(2)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] ?? ''}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
