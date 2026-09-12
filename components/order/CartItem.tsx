'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/lib/slices/cart-slice'

interface CartItemProps {
  item: CartItemType
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const itemTotal = item.price * item.quantity

  return (
    <div className="flex gap-4 rounded-2xl border bg-card p-4">
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">
              {item.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              £{Number(item.price).toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-9 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Total */}
          <p className="font-semibold text-primary">
            £{Number(itemTotal).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}