'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

type FoodItem = {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  category?: string
}

interface FoodCardProps {
  item: FoodItem
  variant?: 'grid' | 'row'
  onAdd?: (item: FoodItem) => void
}

export function FoodCard({ item, variant = 'grid', onAdd }: FoodCardProps) {
  if (variant === 'row') {
    return (
      <Link
        href={`/product/${item.id}`}
        className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary transition"
      >
        <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 relative overflow-hidden">
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{item.name}</p>
          <p className="text-sm font-bold text-accent mt-0.5">£{item.price.toFixed(2)}</p>
        </div>
        {onAdd && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onAdd(item)
            }}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-primary hover:bg-primary/90 rounded-full transition"
          >
            <span className="text-base font-bold text-primary-foreground">+</span>
          </button>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/product/${item.id}`}
      className="w-40 flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all sm:w-auto"
    >
      <div className="relative aspect-square bg-muted">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        )}
        <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
          £{item.price.toFixed(2)}
        </span>
      </div>
      <div className="p-3">
        <p className="truncate font-semibold text-sm">{item.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="text-xs text-muted-foreground">{item.category}</span>
        </div>
      </div>
    </Link>
  )
}