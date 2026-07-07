import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminBookings() {
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
              <h1 className="text-4xl font-bold">Catering Bookings</h1>
              <p className="text-muted-foreground">Manage catering event requests</p>
            </div>
          </div>

          {/* Bookings List */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-secondary border-b border-border font-semibold">
              <div>Event</div>
              <div>Date</div>
              <div>Guests</div>
              <div>Location</div>
              <div>Status</div>
            </div>

            {/* Sample Booking Row */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-border items-center hover:bg-secondary/50 transition">
              <div>Wedding</div>
              <div>12 Oct 2026</div>
              <div>80 guests</div>
              <div className="text-sm text-muted-foreground">Manchester</div>
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
