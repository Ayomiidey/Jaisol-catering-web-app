'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { addToCart, removeFromCart } from '@/lib/slices/cart-slice'
import { useQuery } from '@tanstack/react-query'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  isAvailable: boolean
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/menu/${productId}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Link href="/explore">
          <Button className="bg-orange-500 hover:bg-orange-600">Back to Menu</Button>
        </Link>
      </div>
    )
  }

  const cartItem = cart.items.find((item) => item.id === productId)
  const cartQuantity = cartItem?.quantity || 0

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      })
    )
    setQuantity(1)
  }

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(productId))
  }

  const handleCheckout = () => {
    router.push('/order')
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center">{product.name}</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Product Image */}
      <section className="relative w-full h-80 bg-secondary">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
      </section>

      {/* Product Details */}
      <section className="px-4 py-6 space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-orange-500">{product.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        </div>

        <div>
          <p className="text-4xl font-bold">£{product.price.toFixed(2)}</p>
        </div>

        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {product.isAvailable ? (
          <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm">
            In Stock
          </div>
        ) : (
          <div className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm">
            Out of Stock
          </div>
        )}
      </section>

      {/* Quantity & Cart Actions */}
      <section className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-background border-t border-border space-y-3">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <div className="flex items-center gap-3 bg-secondary rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-orange-500/20 rounded transition"
            >
              <Minus className="w-4 h-4 text-orange-500" />
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:bg-orange-500/20 rounded transition"
            >
              <Plus className="w-4 h-4 text-orange-500" />
            </button>
          </div>
        </div>

        {/* Cart Status */}
        {cartQuantity > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/50">
            <span className="text-sm text-orange-400">{cartQuantity} in cart</span>
            <button
              onClick={handleRemoveFromCart}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          {cartQuantity > 0 && (
            <Button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white">
              Checkout
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
