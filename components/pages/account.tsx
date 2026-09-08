'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, User, ShoppingBag, UtensilsCrossed, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Order {
  id: string
  items: string[]
  date: string
  amount: number
  status: string
}

interface Booking {
  id: string
  event: string
  date: string
  location: string
  status: string
}

export function Account() {
  const { data: session, status } = useSession()
  const { data: ordersData, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['user-orders', (session?.user as { id?: string } | undefined)?.id],
    queryFn: async () => {
      const response = await fetch('/api/orders/user')
      if (!response.ok) throw new Error('Failed to fetch orders')
      return response.json()
    },
    enabled: status === 'authenticated' && !!session?.user,
    retry: 2,
  })

  const { data: bookingsData } = useQuery<Booking[]>({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const response = await fetch('/api/catering/user')
      if (!response.ok) return []
      return response.json()
    },
    enabled: status === 'authenticated' && !!session?.user,
  })

  const orders = ordersData ?? []
  const bookings = bookingsData ?? []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'confirmed':
        return 'text-green-500'
      case 'making':
      case 'processing':
        return 'text-orange-500'
      case 'pending':
        return 'text-yellow-500'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center pb-24">
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
          <h1 className="text-xl font-bold">My Account</h1>
        </header>

        <section className="px-4 py-12 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Sign in to manage your orders</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View order history, catering requests, and checkout faster.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href="/sign-in">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full bg-secondary hover:bg-secondary/80 border border-border">
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <h1 className="text-xl font-bold">My Account</h1>
      </header>

      {/* Profile Section */}
      <section className="px-4 py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {session?.user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{session?.user?.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="px-4 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Recent Orders
          </h3>
        </div>

        {ordersLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading recent orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-4">No orders yet</p>
            <Link href="/explore">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Ordering
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-lg bg-secondary border border-border hover:border-orange-500 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {Array.isArray(order.items) ? order.items.join(' + ') : order.items}
                  </h4>
                  <span className={`text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                  <span className="font-semibold text-orange-500">£{order.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Catering */}
      <section className="px-4 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Upcoming Catering
          </h3>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-4">No catering bookings yet</p>
            <Link href="/book">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Book Catering
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-lg bg-secondary border border-border hover:border-orange-500 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{booking.event}</h4>
                  <span className={`text-xs font-bold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {booking.date} · {booking.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Admin Access (if admin) */}
      {(session?.user as any)?.isAdmin && (
        <section className="px-4 py-4 border-b border-border">
          <Link href="/admin">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-semibold text-sm text-orange-500">Admin Dashboard</p>
                <p className="text-xs text-muted-foreground">Manage orders, bookings & menu</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 py-6 border-b border-border space-y-3">
        <Link href="/explore">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Order More Food
          </Button>
        </Link>
        <Link href="/book">
          <Button className="w-full bg-secondary hover:bg-secondary/80 border border-border">
            Book Catering
          </Button>
        </Link>
      </section>

      {/* Sign Out */}
      <section className="px-4 py-6">
        <button
          onClick={() => signOut({ redirect: true, redirectTo: '/' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </section>
    </div>
  )
}
