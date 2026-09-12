'use client'

import { CartItem as CartItemType } from '@/lib/slices/cart-slice'
import { CartItem } from './CartItem'

interface CartItemsProps {
  items: CartItemType[]
  onIncrease: (item: CartItemType) => void
  onDecrease: (item: CartItemType) => void
  onRemove: (item: CartItemType) => void
}

export function CartItems({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemsProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Your Items
        </h2>

        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={() => onIncrease(item)}
            onDecrease={() => onDecrease(item)}
            onRemove={() => onRemove(item)}
          />
        ))}
      </div>
    </section>
  )
}