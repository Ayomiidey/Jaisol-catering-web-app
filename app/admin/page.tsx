import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ShoppingBag, UtensilsCrossed, Utensils, BarChart3, Images } from 'lucide-react'
import { AdminDashboardStats } from './stats-client'

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your catering business</p>
            </div>
            <Link href="/" className="text-sm text-orange-500 hover:underline">
              ← View site
            </Link>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Link href="/admin/orders">
              <div className="p-5 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer h-full">
                <ShoppingBag className="w-7 h-7 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold">Orders</h2>
                <p className="text-muted-foreground text-sm mt-1">Food delivery orders</p>
              </div>
            </Link>
            <Link href="/admin/bookings">
              <div className="p-5 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer h-full">
                <UtensilsCrossed className="w-7 h-7 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold">Bookings</h2>
                <p className="text-muted-foreground text-sm mt-1">Catering events</p>
              </div>
            </Link>
            <Link href="/admin/menu">
              <div className="p-5 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer h-full">
                <Utensils className="w-7 h-7 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold">Menu</h2>
                <p className="text-muted-foreground text-sm mt-1">Items & pricing</p>
              </div>
            </Link>
            <Link href="/admin/analytics">
              <div className="p-5 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer h-full">
                <BarChart3 className="w-7 h-7 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold">Analytics</h2>
                <p className="text-muted-foreground text-sm mt-1">Business insights</p>
              </div>
            </Link>
            <Link href="/admin/carousel">
              <div className="p-5 rounded-lg bg-secondary border border-border hover:border-orange-500 transition cursor-pointer h-full">
                <Images className="w-7 h-7 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold">Carousel</h2>
                <p className="text-muted-foreground text-sm mt-1">Homepage banners</p>
              </div>
            </Link>
          </div>

          {/* Live Stats */}
          <AdminDashboardStats />
        </div>
      </div>
    </AdminGuard>
  )
}
