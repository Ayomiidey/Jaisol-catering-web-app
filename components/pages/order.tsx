'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { removeFromCart, updateCartItem, clearCart, setDeliveryInfo } from '@/lib/slices/cart-slice'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Order() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session, status } = useSession()
  const cart = useSelector((state: RootState) => state.cart)
  const [deliveryAddress, setDeliveryAddress] = useState(cart.deliveryAddress || '')
  const [phone, setPhone] = useState(cart.phone || '')
  const [notes, setNotes] = useState(cart.specialNotes || '')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!deliveryAddress || deliveryAddress.trim().length === 0) {
      newErrors.address = 'Delivery address is required'
    } else if (deliveryAddress.trim().length < 5) {
      newErrors.address = 'Please enter a valid address'
    }

    if (!phone || phone.trim().length === 0) {
      newErrors.phone = 'Phone number is required'
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (cart.items.length === 0) {
      newErrors.cart = 'Your cart is empty'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      return
    }

    if (status !== 'authenticated' || !session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent('/order')}`)
      return
    }

    setLoading(true)

    try {
      // Create order in database
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          totalPrice: cart.totalPrice + 2.5,
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        if (orderResponse.status === 401) {
          router.push(`/sign-in?callbackUrl=${encodeURIComponent('/order')}`)
          return
        }

        setErrors({ submit: orderData.error || 'Failed to create order' })
        setLoading(false)
        return
      }

      // Send WhatsApp notification
      const itemsList = cart.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join('\n')

      const message = `
📦 *New Order Placed*

*Order ID:* ${orderData.order.id}
*Total:* £${(cart.totalPrice + 2.5).toFixed(2)}

*Items:*
${itemsList}

*Delivery Address:* ${deliveryAddress}
*Phone:* ${phone}
*Special Notes:* ${notes || 'None'}

Status: Pending confirmation
      `.trim()

      const encodedMessage = encodeURIComponent(message)
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')

      dispatch(
        setDeliveryInfo({
          deliveryAddress,
          phone,
          specialNotes: notes,
        })
      )

      setSubmitted(true)
      setTimeout(() => {
        dispatch(clearCart())
        setSubmitted(false)
        setDeliveryAddress('')
        setPhone('')
        setNotes('')
      }, 2000)
    } catch (error) {
      console.error('Error creating order:', error)
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold">Order Confirmed!</h2>
          <p className="text-muted-foreground">Your order has been placed successfully.</p>
          <p className="text-sm text-muted-foreground">You will receive a confirmation email shortly.</p>
          <Link href="/">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/explore" className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Your Order</h1>
        </div>
      </header>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/explore">
            <Button className="bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <section className="px-4 py-6 space-y-3">
            <h2 className="text-lg font-semibold">Order Items</h2>
            {cart.items.map((item) => (
              <div key={item.id} className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="p-2 hover:bg-destructive/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-orange-500">
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2 bg-orange-500 rounded-lg">
                    <button
                      onClick={() =>
                        dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }))
                      }
                      className="p-1 hover:bg-orange-600 transition"
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </button>
                    <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }))
                      }
                      className="p-1 hover:bg-orange-600 transition"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Delivery Information */}
          <section className="px-4 py-6 space-y-4 border-t border-border">
            <h2 className="text-lg font-semibold">Delivery Information</h2>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value)
                  if (errors.address) setErrors({ ...errors, address: '' })
                }}
                className={`bg-secondary border-border ${errors.address ? 'border-red-500 border-2' : ''}`}
              />
              {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors({ ...errors, phone: '' })
                }}
                className={`bg-secondary border-border ${errors.phone ? 'border-red-500 border-2' : ''}`}
              />
              {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <textarea
                id="notes"
                placeholder="Any special dietary requirements or delivery instructions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 resize-none"
                rows={3}
              />
            </div>
          </section>

          {/* Order Summary */}
          <section className="px-4 py-6 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>£{cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>£2.50</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-orange-500">£{(cart.totalPrice + 2.5).toFixed(2)}</span>
            </div>
          </section>

          {/* Checkout Button */}
          <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-background border-t border-border">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </Button>
            {errors.submit && <p className="mt-2 text-center text-sm text-red-400">{errors.submit}</p>}
          </div>
        </>
      )}
    </div>
  )
}
