import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, UtensilsCrossed, Utensils, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your catering business</p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Orders */}
            <Link href="/admin/orders">
              <div className="p-6 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Orders</h2>
                    <p className="text-muted-foreground">Manage food orders and delivery</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </Link>

            {/* Bookings */}
            <Link href="/admin/bookings">
              <div className="p-6 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Catering Bookings</h2>
                    <p className="text-muted-foreground">Manage event catering requests</p>
                  </div>
                  <UtensilsCrossed className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </Link>

            {/* Menu */}
            <Link href="/admin/menu">
              <div className="p-6 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Menu</h2>
                    <p className="text-muted-foreground">Create and edit menu items</p>
                  </div>
                  <Utensils className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link href="/admin/analytics">
              <div className="p-6 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Analytics</h2>
                    <p className="text-muted-foreground">View business insights</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-500">12</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-1">Pending Bookings</p>
              <p className="text-3xl font-bold text-orange-500">5</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-1">This Month Revenue</p>
              <p className="text-3xl font-bold text-orange-500">£2,450</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-orange-500">284</p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
