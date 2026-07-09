'use client'

import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, TrendingUp, ShoppingBag, UtensilsCrossed, DollarSign } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface AnalyticsData {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: string | null
  totalOrders: number
  monthlyOrders: number
  ordersGrowth: string | null
  avgOrderValue: number
  totalBookings: number
  monthlyBookings: number
  topItems: { name: string; count: number }[]
  eventTypes: { name: string; count: number }[]
}

function AnalyticsContent() {
  const { data, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const maxItemCount = data?.topItems?.[0]?.count ?? 1
  const maxEventCount = data?.eventTypes?.[0]?.count ?? 1

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Analytics</h1>
              <p className="text-muted-foreground text-sm">Business insights & metrics</p>
            </div>
          </div>
          <button onClick={() => refetch()} className="p-2 hover:bg-secondary rounded-lg transition">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : data ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <p className="text-muted-foreground text-xs">Total Revenue</p>
                </div>
                <p className="text-2xl font-bold text-orange-500">£{data.totalRevenue.toFixed(0)}</p>
                {data.monthlyRevenue > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">£{data.monthlyRevenue.toFixed(0)} this month</p>
                )}
                {data.revenueGrowth && (
                  <p className={`text-xs mt-1 ${Number(data.revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {Number(data.revenueGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(data.revenueGrowth))}% vs last month
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <p className="text-muted-foreground text-xs">Total Orders</p>
                </div>
                <p className="text-2xl font-bold text-blue-500">{data.totalOrders}</p>
                {data.monthlyOrders > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{data.monthlyOrders} this month</p>
                )}
                {data.ordersGrowth && (
                  <p className={`text-xs mt-1 ${Number(data.ordersGrowth) >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {Number(data.ordersGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(data.ordersGrowth))}% vs last month
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="text-muted-foreground text-xs">Avg Order Value</p>
                </div>
                <p className="text-2xl font-bold text-green-500">£{data.avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Per order</p>
              </div>

              <div className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <UtensilsCrossed className="w-4 h-4 text-purple-500" />
                  <p className="text-muted-foreground text-xs">Catering Bookings</p>
                </div>
                <p className="text-2xl font-bold text-purple-500">{data.totalBookings}</p>
                {data.monthlyBookings > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{data.monthlyBookings} this month</p>
                )}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Items */}
              <div className="p-5 rounded-lg bg-secondary border border-border">
                <h2 className="text-lg font-bold mb-4">Top Ordered Items</h2>
                {data.topItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">No order data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.topItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <div className="mt-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${(item.count / maxItemCount) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Types */}
              <div className="p-5 rounded-lg bg-secondary border border-border">
                <h2 className="text-lg font-bold mb-4">Catering by Event Type</h2>
                {data.eventTypes.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">No booking data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.eventTypes.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.name}</p>
                          <div className="mt-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${(event.count / maxEventCount) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{event.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">Failed to load analytics</div>
        )}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  return (
    <AdminGuard>
      <AnalyticsContent />
    </AdminGuard>
  )
}

