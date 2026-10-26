'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, CircleAlert, PoundSterling, RefreshCw, ShoppingBag } from 'lucide-react'

interface Stats {
  pendingOrders: number
  pendingBookings: number
  totalOrders: number
  totalBookings: number
  monthlyRevenue: number
  totalRevenue: number
  recentOrders: Array<{ id: string; status: string; totalPrice: number; createdAt: string; user: { name: string | null }; items: Array<{ menuItem: { name: string }; quantity: number }> }>
  recentBookings: Array<{ id: string; status: string; eventType: string; guestCount: number; date: string; location: string; estimatedCost?: number | null; user: { name: string | null; email: string | null } }>
}

const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)
const statusClass: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300', confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  making: 'bg-primary/20 text-foreground', ready: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', cancelled: 'bg-destructive/15 text-destructive',
}
const Status = ({ value }: { value: string }) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[value] ?? 'bg-muted text-muted-foreground'}`}>{value.replaceAll('_', ' ')}</span>

export function AdminDashboardStats() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch dashboard data')
      return res.json()
    },
    refetchInterval: 30000,
  })

  if (isLoading) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />)}</div>
  if (isError || !data) return <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/20 bg-card p-5"><div className="flex items-center gap-3"><CircleAlert className="h-5 w-5 text-destructive" /><div><p className="font-semibold">Dashboard data could not load</p><p className="text-sm text-muted-foreground">Check your connection and try again.</p></div></div><button type="button" onClick={() => refetch()} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try again</button></div>

  const metrics = [
    { label: 'Orders to review', value: data.pendingOrders, hint: `${data.totalOrders} total orders`, icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Bookings to review', value: data.pendingBookings, hint: `${data.totalBookings} total bookings`, icon: CalendarDays, href: '/admin/bookings' },
    { label: 'Revenue this month', value: money(data.monthlyRevenue), hint: `${money(data.totalRevenue)} all time`, icon: PoundSterling, href: '/admin/analytics' },
    { label: 'All orders', value: data.totalOrders, hint: 'View and manage customer orders', icon: ShoppingBag, href: '/admin/orders' },
  ]

  return <div className="space-y-8">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, hint, icon: Icon, href }) => <Link key={label} href={href} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{label}</p><span className="rounded-xl bg-primary/15 p-2 text-primary"><Icon className="h-4 w-4" /></span></div><p className="mt-4 text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-sm text-muted-foreground">{hint}</p></Link>)}
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="font-bold">Recent orders</h2><p className="text-sm text-muted-foreground">Latest customer purchases</p></div><div className="flex items-center gap-3"><button type="button" aria-label="Refresh dashboard" onClick={() => refetch()} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /></button><Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">All orders <ArrowUpRight className="h-4 w-4" /></Link></div></div>
        {data.recentOrders.length ? <div className="divide-y divide-border">{data.recentOrders.map(order => <div key={order.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{order.user.name || 'Customer'}</p><p className="mt-1 truncate text-xs text-muted-foreground">{order.items.map(item => `${item.quantity}× ${item.menuItem.name}`).join(', ') || 'No item details'}</p></div><div className="flex shrink-0 flex-col items-end gap-2"><span className="text-sm font-semibold">{money(order.totalPrice)}</span><Status value={order.status} /></div></div>)}</div> : <p className="p-8 text-center text-sm text-muted-foreground">No orders yet. New customer orders will appear here.</p>}
      </section>
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="font-bold">Recent catering bookings</h2><p className="text-sm text-muted-foreground">Upcoming event requests</p></div><Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">All bookings <ArrowUpRight className="h-4 w-4" /></Link></div>
        {data.recentBookings.length ? <div className="divide-y divide-border">{data.recentBookings.map(booking => <div key={booking.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{booking.eventType} · {booking.guestCount} guests</p><p className="mt-1 truncate text-xs text-muted-foreground">{booking.user.name || booking.user.email || 'Customer'} · {booking.location} · {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><div className="flex shrink-0 flex-col items-end gap-2">{booking.estimatedCost != null && <span className="text-sm font-semibold">{money(booking.estimatedCost)}</span>}<Status value={booking.status} /></div></div>)}</div> : <p className="p-8 text-center text-sm text-muted-foreground">No bookings yet. Customer event requests will appear here.</p>}
      </section>
    </div>
  </div>
}
