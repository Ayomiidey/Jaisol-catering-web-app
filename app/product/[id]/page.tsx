'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getMenuItemById, getMenuItems } from '@/app/actions/menu'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  ChefHat,
  MessageCircle,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { addToCart, removeFromCart, updateCartItem } from '@/lib/slices/cart-slice'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const id = params.id as string
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['menu-item', id],
    queryFn: () => getMenuItemById(id),
    enabled: !!id,
  })

  const { data: allItems = [] } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  })

  const relatedItems = allItems
    .filter((i) => i.id !== id && i.category === item?.category)
    .slice(0, 4)

  const cartItem = cartItems.find((c) => c.menuItemId === id)
  const quantity = cartItem?.quantity ?? 0

  const handleAdd = () => {
    if (!item) return
    dispatch(
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
    )
  }

  const handleDecrease = () => {
    if (!cartItem) return
    if (cartItem.quantity <= 1) {
      dispatch(removeFromCart(cartItem.id))
    } else {
      dispatch(updateCartItem({ id: cartItem.id, quantity: cartItem.quantity - 1 }))
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447000000000'

  const handleWhatsAppEnquiry = () => {
    if (!item) return
    const message = encodeURIComponent(
      `Hi! I'd like to enquire about "${item.name}" (£${item.price.toFixed(2)}). Is it available?`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ChefHat className="w-8 h-8 text-orange-500 animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold">Item not found</p>
        <Link href="/explore">
          <Button className="bg-orange-500 hover:bg-orange-600">Back to Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 lg:pb-24 lg:max-w-7xl lg:mx-auto lg:px-6">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-secondary rounded-lg transition -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold truncate max-w-[200px]">{item.name}</h1>
        <Link href="/order" className="p-2 hover:bg-secondary rounded-lg transition relative">
          <ShoppingCart className="w-5 h-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartItems.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </Link>
      </header>

      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] bg-secondary overflow-hidden rounded-none lg:rounded-2xl lg:mt-6">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain p-4 lg:p-8"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-6 space-y-4">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold uppercase tracking-wide">
          {item.category}
        </span>

        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold leading-tight">{item.name}</h2>
          <span className="text-2xl font-bold text-orange-500 flex-shrink-0">
            £{item.price.toFixed(2)}
          </span>
        </div>

        {/* Rating (static for now) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">4.0 · West African cuisine</span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Preparation Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Prep time</p>
            <p className="font-semibold text-sm mt-0.5">20–30 min</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">Serves</p>
            <p className="font-semibold text-sm mt-0.5">1 person</p>
          </div>
        </div>

        {/* WhatsApp Enquiry */}
        <button
          onClick={handleWhatsAppEnquiry}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-green-500/50 bg-green-500/10 text-green-500 font-medium text-sm hover:bg-green-500/20 transition"
        >
          <MessageCircle className="w-4 h-4" />
          Enquire on WhatsApp
        </button>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="px-4 py-4 border-t border-border lg:px-0">
          <h3 className="text-lg font-semibold mb-4">More from {item.category}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-2">
            {relatedItems.map((rel) => (
              <Link
                key={rel.id}
                href={`/product/${rel.id}`}
                className="rounded-lg overflow-hidden bg-secondary border border-border hover:border-orange-500 transition"
              >
                <div className="aspect-square bg-muted relative">
                  {rel.imageUrl && (
                    <Image src={rel.imageUrl} alt={rel.name} fill className="object-cover" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{rel.name}</p>
                  <p className="text-xs text-orange-500 font-semibold">£{rel.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fixed Bottom Add to Cart */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-background border-t border-border z-30">
        {item.isAvailable ? (
          quantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-orange-500 rounded-xl px-3 py-2">
                <button onClick={handleDecrease} className="p-1 hover:bg-orange-600 rounded transition">
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={handleAdd} className="p-1 hover:bg-orange-600 rounded transition">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              <Link href="/order" className="flex-1 ml-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-6">
                  View Cart · £{((cartItems.find(c => c.menuItemId === id)?.price ?? item.price) * quantity).toFixed(2)}
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-6 text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Cart · £{item.price.toFixed(2)}
            </Button>
          )
        ) : (
          <Button disabled className="w-full py-6 text-base" variant="outline">
            Currently Unavailable
          </Button>
        )}
      </div>
    </div>
  )
}
