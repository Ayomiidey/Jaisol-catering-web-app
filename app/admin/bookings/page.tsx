'use client'

import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ChevronDown } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

interface Booking {
  id: string
  eventType: string
  guestCount: number
  date: string
  location: string
  dietaryNeeds?: string | null
  notes?: string | null
  status: string
  estimatedCost?: number | null
  createdAt: string
  user: { name: string; email: string }
}

function BookingsContent() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [costInputs, setCostInputs] = useState<Record<string, string>>({})

  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/api/admin/bookings?status=${statusFilter}`
        : '/api/admin/bookings'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const updateBooking = useMutation({
    mutationFn: async ({ id, status, estimatedCost }: { id: string; status?: string; estimatedCost?: number }) => {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, estimatedCost }),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Catering Bookings</h1>
              <p className="text-muted-foreground text-sm">Manage event catering requests</p>
            </div>
          </div>
          <button onClick={() => refetch()} className="p-2 hover:bg-secondary rounded-lg transition">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {['', ...BOOKING_STATUSES].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                statusFilter === s ? 'bg-orange-500 text-white' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No bookings found</div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-border bg-secondary overflow-hidden">
                <div
                  className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 cursor-pointer hover:bg-secondary/80 transition"
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                >
                  <div>
                    <p className="font-semibold text-sm">{booking.user.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.eventType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.guestCount} guests</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-muted-foreground truncate">{booking.location}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-orange-500">
                      {booking.estimatedCost ? `£${booking.estimatedCost.toFixed(2)}` : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status] ?? ''}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {expandedId === booking.id && (
                  <div className="border-t border-border p-4 space-y-4 bg-background/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Customer Email</p>
                        <p>{booking.user.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Location</p>
                        <p>{booking.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Dietary Needs</p>
                        <p>{booking.dietaryNeeds ? JSON.parse(booking.dietaryNeeds).join(', ') : 'None'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Booking ID</p>
                        <p className="font-mono text-xs">{booking.id}</p>
                      </div>
                      {booking.notes && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground mb-1">Notes</p>
                          <p className="italic">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Set Cost */}
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Set Estimated Cost</p>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="e.g. 1200"
                          value={costInputs[booking.id] ?? booking.estimatedCost ?? ''}
                          onChange={(e) => setCostInputs({ ...costInputs, [booking.id]: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() =>
                            updateBooking.mutate({
                              id: booking.id,
                              estimatedCost: Number(costInputs[booking.id]),
                            })
                          }
                          disabled={!costInputs[booking.id] || updateBooking.isPending}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {BOOKING_STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={booking.status === s || updateBooking.isPending}
                            onClick={() => updateBooking.mutate({ id: booking.id, status: s })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition disabled:opacity-50 ${
                              booking.status === s
                                ? 'bg-orange-500 text-white'
                                : 'bg-secondary hover:bg-orange-500/20 border border-border'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminBookings() {
  return (
    <AdminGuard>
      <BookingsContent />
    </AdminGuard>
  )
}
