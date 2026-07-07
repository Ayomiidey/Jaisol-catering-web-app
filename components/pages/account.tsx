'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, User, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

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
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  const { data: ordersData } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders/user')
      if (!response.ok) return []
      return response.json()
    },
    enabled: !!session,
  })

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData)
    }
  }, [ordersData])

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

  const mockBookings = [
    {
      id: '1',
      event: 'Wedding - 80 guests',
      date: '12 Oct',
      location: 'Manchester',
      status: 'Confirmed',
    },
  ]

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

        {orders.length === 0 ? (
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

        {mockBookings.length === 0 ? (
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
            {mockBookings.map((booking) => (
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
          onClick={() => signOut({ redirect: true, redirectTo: '/sign-in' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </section>
    </div>
  )
}
