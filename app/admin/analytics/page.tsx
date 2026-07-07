import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminAnalytics() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">View business insights and metrics</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
              <p className="text-4xl font-bold text-orange-500 mb-1">£12,450</p>
              <p className="text-xs text-green-500">↑ 12% this month</p>
            </div>
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-orange-500 mb-1">284</p>
              <p className="text-xs text-green-500">↑ 28 this month</p>
            </div>
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-2">Avg Order Value</p>
              <p className="text-4xl font-bold text-orange-500 mb-1">£43.81</p>
              <p className="text-xs text-green-500">↑ 5% vs last month</p>
            </div>
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <p className="text-muted-foreground text-sm mb-2">Catering Bookings</p>
              <p className="text-4xl font-bold text-orange-500 mb-1">18</p>
              <p className="text-xs text-green-500">↑ 6 this month</p>
            </div>
          </div>

          {/* Popular Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <h2 className="text-xl font-bold mb-4">Top Items</h2>
              <div className="space-y-3">
                {[
                  { name: 'Jollof Rice', count: 87 },
                  { name: 'Puff Puff', count: 65 },
                  { name: 'Fullhouse Box', count: 52 },
                  { name: 'Grilled Lamb', count: 48 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${(item.count / 87) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg bg-secondary border border-border">
              <h2 className="text-xl font-bold mb-4">Event Types</h2>
              <div className="space-y-3">
                {[
                  { name: 'Wedding', count: 8 },
                  { name: 'Birthday', count: 6 },
                  { name: 'Corporate', count: 3 },
                  { name: 'Other', count: 1 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(item.count / 8) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
