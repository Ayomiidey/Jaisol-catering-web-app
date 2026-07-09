'use client'

import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ChevronDown } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const ORDER_STATUSES = ['pending', 'confirmed', 'making', 'ready', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  making: 'bg-orange-500/20 text-orange-400',
  ready: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

interface OrderItem {
  id: string
  quantity: number
  priceAtPurchase: number
  menuItem: { name: string }
}

interface Order {
  id: string
  status: string
  totalPrice: number
  deliveryAddress: string
  phone: string
  notes?: string
  createdAt: string
  user: { name: string; email: string }
  items: OrderItem[]
}

function OrdersContent() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/api/admin/orders?status=${statusFilter}`
        : '/api/admin/orders'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
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
              <h1 className="text-2xl md:text-4xl font-bold">Orders</h1>
              <p className="text-muted-foreground text-sm">Manage all food orders</p>
            </div>
          </div>
          <button onClick={() => refetch()} className="p-2 hover:bg-secondary rounded-lg transition">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {['', ...ORDER_STATUSES].map((s) => (
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
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No orders found</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-secondary overflow-hidden">
                <div
                  className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 cursor-pointer hover:bg-secondary/80 transition"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="font-semibold text-sm">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.user.email}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500">£{order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center justify-end">
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="border-t border-border p-4 space-y-4 bg-background/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Order ID</p>
                        <p className="font-mono text-xs">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Phone</p>
                        <p>{order.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-1">Delivery Address</p>
                        <p>{order.deliveryAddress}</p>
                      </div>
                      {order.notes && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground mb-1">Notes</p>
                          <p className="italic">{order.notes}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}× {item.menuItem.name}</span>
                            <span className="text-muted-foreground">£{(item.quantity * item.priceAtPurchase).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {ORDER_STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={order.status === s || updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition disabled:opacity-50 ${
                              order.status === s
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

export default function AdminOrders() {
  return (
    <AdminGuard>
      <OrdersContent />
    </AdminGuard>
  )
}
