'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { getMenuItems } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { ShoppingCart, UtensilsCrossed, Cake, Search, Bell } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setSearchTerm, setCategory, clearFilters } from '@/lib/slices/filter-slice'
import { addToCart } from '@/lib/slices/cart-slice'

export function Home() {
  const [greeting] = useState('Hi, Amara 👋')
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  })

  const categories = ['All', 'Mains', 'Starters', 'Pastries', 'Cakes']
  const featuredItems = menuItems.slice(0, 3)
  const popularItems = menuItems.slice(0, 3)

  const handleAddToCart = (item: any) => {
    dispatch(
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">What are you craving today?</p>
            <h1 className="text-lg font-semibold">{greeting}</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <section className="px-4 py-4">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            Featured this week
          </span>
          <h2 className="text-2xl font-bold mb-1">Authentic West African catering — across the UK</h2>
          <p className="text-sm text-orange-100 mb-4">Weddings · Birthdays · Corporate events</p>
          <Link href="/book">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
              Book a date →
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Quick actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/explore" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            <span className="text-xs font-medium text-center">Order food<br/>Delivery & pickup</span>
          </Link>
          <Link href="/book" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <span className="text-xs font-medium text-center">Book catering<br/>Events & parties</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition">
            <Cake className="w-6 h-6 text-orange-500" />
            <span className="text-xs font-medium text-center">Custom cakes<br/>Consultation</span>
          </Link>
        </div>
      </section>

      {/* From the Kitchen */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">From the kitchen</h3>
          <Link href="/explore" className="text-orange-500 text-sm font-medium hover:underline">
            See all
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-32 rounded-lg overflow-hidden bg-secondary border border-border hover:border-orange-500 transition"
            >
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Popular dishes</h3>
          <Link href="/explore" className="text-orange-500 text-sm font-medium hover:underline">
            View menu
          </Link>
        </div>
        <div className="space-y-3">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border hover:border-orange-500 transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">£{item.price.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="flex-shrink-0 p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
              >
                <span className="text-sm font-bold text-white">+</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Catering Banner */}
      <section className="px-4 py-6">
        <div className="border border-orange-500 rounded-lg p-4 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Catering slots open — Aug & Sep</p>
              <p className="text-xs text-muted-foreground mt-1">Limited dates remaining</p>
              <Link href="/book">
                <Button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white h-8 text-xs">
                  Reserve
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">What people say</h3>
          <Link href="#" className="text-orange-500 text-sm font-medium hover:underline">
            All reviews
          </Link>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary border border-border">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-lg">⭐</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                {i === 1
                  ? '"Absolutely loved the catering! The food was authentic and delicious."'
                  : '"Best jollof rice I\'ve had outside of West Africa!"'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
