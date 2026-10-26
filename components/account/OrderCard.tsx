'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { CalendarDays, CheckCircle2, MapPin, Phone, Repeat2, ShoppingBag } from 'lucide-react'
import { Order } from '@/types/account'
import { addToCart, setDeliveryInfo } from '@/lib/slices/cart-slice'

interface OrderCardProps { order: Order }

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered': case 'confirmed': case 'completed': case 'ready': return 'bg-primary/15 text-foreground'
    case 'making': case 'processing': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'pending': case 'awaiting_whatsapp_confirmation': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'cancelled': return 'bg-destructive/10 text-destructive'
    default: return 'bg-muted text-muted-foreground'
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const availableCount = order.items.filter((item) => item.menuItem.isAvailable).length
  const displayStatus = order.status === 'awaiting_whatsapp_confirmation' ? 'Awaiting WhatsApp confirmation' : order.status.replaceAll('_', ' ')

  const reorder = () => {
    const availableItems = order.items.filter((item) => item.menuItem.isAvailable)
    if (availableItems.length === 0) {
      setMessage('These dishes are currently unavailable. Browse the menu for alternatives.')
      return
    }

    for (const item of availableItems) {
      dispatch(addToCart({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        imageUrl: item.menuItem.imageUrl,
        quantity: item.quantity,
        notes: item.notes ?? undefined,
      }))
    }
    dispatch(setDeliveryInfo({ deliveryAddress: order.deliveryAddress ?? undefined, phone: order.phone ?? undefined, specialNotes: '', foodAllergies: order.allergies ?? '' }))
    const skipped = order.items.length - availableItems.length
    setMessage(skipped ? `${skipped} item${skipped === 1 ? '' : 's'} unavailable. Available dishes are in your cart.` : 'Your previous items were added at today’s prices.')
    router.push(`/cart?reorder=${skipped ? 'partial' : 'complete'}`)
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary"><ShoppingBag className="h-5 w-5" /></div>
          <div><p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(order.status)}`}>{displayStatus}</span>
      </div>

      <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
        {order.items.map((item) => <li key={item.menuItemId} className="flex items-center justify-between gap-3"><span className="min-w-0 truncate">{item.quantity} × {item.menuItem.name}{!item.menuItem.isAvailable && <span className="ml-2 text-xs text-destructive">Unavailable</span>}</span><span className="shrink-0 text-muted-foreground">£{(item.quantity * item.priceAtPurchase).toFixed(2)}</span></li>)}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div><p className="text-xs text-muted-foreground">Order total</p><p className="text-lg font-bold">£{order.amount.toFixed(2)}</p></div>
        <button type="button" onClick={reorder} disabled={!availableCount} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Repeat2 className="h-4 w-4" />Reorder</button>
      </div>

      {!availableCount && <p className="mt-3 text-sm text-muted-foreground">All items in this order are currently unavailable. Browse the menu for alternatives.</p>}

      {(order.deliveryAddress || order.phone) && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">{order.deliveryAddress && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{order.deliveryAddress}</span>}{order.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{order.phone}</span>}</div>}
      {order.allergies && <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm"><span className="font-semibold text-destructive">Allergy information: </span>{order.allergies}</p>}
      {message && <p role="status" className="mt-3 flex items-start gap-2 rounded-xl bg-primary/10 p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{message}</p>}
    </article>
  )
}
