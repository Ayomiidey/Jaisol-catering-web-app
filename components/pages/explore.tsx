'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { getMenuItems } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setCategory, setSearchTerm, clearFilters } from '@/lib/slices/filter-slice'
import { addToCart, removeFromCart, updateCartItem } from '@/lib/slices/cart-slice'
import { useState } from 'react'

export function Explore() {
  const dispatch = useDispatch()
  const selectedCategory = useSelector((state: RootState) => state.filters.selectedCategory)
  const searchTerm = useSelector((state: RootState) => state.filters.searchTerm)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [localSearch, setLocalSearch] = useState('')

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  })

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  const filtered = menuItems.filter((item) => {
    const matchCategory = !selectedCategory || item.category === selectedCategory
    const search = localSearch || searchTerm
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const getCartQuantity = (menuItemId: string) => {
    const items = cartItems.filter((item) => item.menuItemId === menuItemId)
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handleAddToCart = (item: any) => {
    dispatch(
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      })
    )
  }

  const handleRemoveFromCart = (menuItemId: string) => {
    const cartItem = cartItems.find((item) => item.menuItemId === menuItemId)
    if (cartItem) {
      dispatch(removeFromCart(cartItem.id))
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Menu</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search menu..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-orange-500"
        />
      </header>

      {/* Category Filter */}
      <section className="px-4 py-3 flex gap-2 overflow-x-auto pb-2 border-b border-border sticky top-[80px] z-10 bg-background">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === 'All') {
                dispatch(clearFilters())
              } else {
                dispatch(setCategory(cat))
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
              (cat === 'All' && !selectedCategory) || selectedCategory === cat
                ? 'bg-orange-500 text-white'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Menu Items Grid */}
      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => {
            const quantity = getCartQuantity(item.id)
            return (
              <Link key={item.id} href={`/product/${item.id}`}>
                <div className="rounded-lg bg-secondary border border-border overflow-hidden hover:border-orange-500 transition cursor-pointer h-full flex flex-col">
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
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3" onClick={(e) => e.preventDefault()}>
                      <span className="font-bold text-orange-500">£{item.price.toFixed(2)}</span>
                      {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-orange-500 rounded-lg">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 hover:bg-orange-600 transition"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-xs font-bold text-white w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-1 hover:bg-orange-600 transition"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </section>
    </div>
  )
}
