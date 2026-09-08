'use client'

import Link from 'next/link'
import { ShoppingCart, UtensilsCrossed, Search, Bell } from 'lucide-react'

interface HomeHeaderProps {
  greeting: string
  cartCount: number
}

export function HomeHeader({ greeting, cartCount }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">What are you craving today?</p>
            <h1 className="text-base font-bold">{greeting}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-secondary rounded-full transition">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition relative">
            <Bell className="w-5 h-5 text-foreground" />
          </button>
          <Link href="/cart" className="p-2 hover:bg-secondary rounded-full transition relative">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}