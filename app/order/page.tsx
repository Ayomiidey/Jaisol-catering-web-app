'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/lib/store'
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setDeliveryInfo,
  CartItem as CartItemType,
} from '@/lib/slices/cart-slice'

import { OrderHeader } from '@/components/order/OrderHeader'
import { CartItems } from '@/components/order/CartItems'
import { DeliveryForm } from '@/components/order/DeliveryForm'
import { OrderSummary } from '@/components/order/OrderSummary'
import { OrderSuccess } from '@/components/order/OrderSuccess'

const DELIVERY_FEE = 2.5

interface FormErrors {
  address?: string
  phone?: string
  cart?: string
}

export default function OrderPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()

  const cart = useSelector((state: RootState) => state.cart)

  const [deliveryAddress, setDeliveryAddress] = useState(
    cart.deliveryAddress || ''
  )

  const [phone, setPhone] = useState(cart.phone || '')

  const [notes, setNotes] = useState(
    cart.specialNotes || ''
  )

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState<string | undefined>()

  /*
   * --------------------------------
   * CART HANDLERS
   * --------------------------------
   */

  const handleIncrease = (item: CartItemType) => {
    dispatch(
      updateCartItem({
        id: item.id,
        quantity: item.quantity + 1,
      })
    )
  }

  const handleDecrease = (item: CartItemType) => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart(item.id))
      return
    }

    dispatch(
      updateCartItem({
        id: item.id,
        quantity: item.quantity - 1,
      })
    )
  }

  const handleRemove = (item: CartItemType) => {
    dispatch(removeFromCart(item.id))
  }

  /*
   * --------------------------------
   * FORM VALIDATION
   * --------------------------------
   */

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!deliveryAddress.trim()) {
      newErrors.address = 'Delivery address is required'
    } else if (deliveryAddress.trim().length < 5) {
      newErrors.address = 'Please enter a valid address'
    }

    if (!phone.trim()) {
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

  /*
   * --------------------------------
   * CHECKOUT
   * --------------------------------
   */

  const handleCheckout = async () => {
    if (!validateForm()) return

    /*
     * User must be authenticated
     */
    if (status !== 'authenticated' || !session?.user) {
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent('/order')}`
      )

      return
    }

    setLoading(true)

    try {
      /*
       * Save delivery information to Redux
       */
      dispatch(
        setDeliveryInfo({
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          specialNotes: notes.trim(),
        })
      )

      /*
       * Create order
       */
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          totalPrice: cart.totalPrice + DELIVERY_FEE,
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(
          orderData?.error || 'Failed to create order'
        )
      }

      /*
       * Store order ID for success screen
       */
      setOrderId(orderData.order?.id)

      /*
       * --------------------------------
       * WHATSAPP NOTIFICATION
       * --------------------------------
       */

      const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
        '447000000000'

      const orderItems = cart.items
        .map(
          (item) =>
            `${item.name} x${item.quantity} - £${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join('\n')

      const whatsappMessage = `
New Jaisol Catering Order

Order ID: ${orderData.order?.id || 'N/A'}

Items:
${orderItems}

Subtotal: £${cart.totalPrice.toFixed(2)}
Delivery: £${DELIVERY_FEE.toFixed(2)}
Total: £${(cart.totalPrice + DELIVERY_FEE).toFixed(2)}

Delivery Address:
${deliveryAddress.trim()}

Phone:
${phone.trim()}

Special Instructions:
${notes.trim() || 'None'}
      `.trim()

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`

      window.open(whatsappUrl, '_blank')

      /*
       * Save order successfully
       */
      setSubmitted(true)

      /*
       * Clear cart after successful order
       */
      setTimeout(() => {
        dispatch(clearCart())

        setDeliveryAddress('')
        setPhone('')
        setNotes('')
      }, 2000)
    } catch (error) {
      console.error('Checkout error:', error)

      setErrors({
        cart:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  /*
   * --------------------------------
   * SUCCESS SCREEN
   * --------------------------------
   */

  if (submitted) {
    return <OrderSuccess orderId={orderId} />
  }

  /*
   * --------------------------------
   * EMPTY CART
   * --------------------------------
   */

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <OrderHeader />

          <div className="rounded-2xl border bg-card p-10 text-center">
            <h2 className="text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Add some delicious food before checking out.
            </p>

            <button
              type="button"
              onClick={() => router.push('/explore')}
              className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Browse menu
            </button>
          </div>
        </div>
      </main>
    )
  }

  /*
   * --------------------------------
   * MAIN ORDER PAGE
   * --------------------------------
   */

  return (
    <main className="min-h-screen bg-background px-4 py-8 pb-32">
      <div className="mx-auto max-w-6xl">
        <OrderHeader />

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT COLUMN */}
          <div>
            <CartItems
              items={cart.items}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />

            <DeliveryForm
              deliveryAddress={deliveryAddress}
              phone={phone}
              notes={notes}
              errors={errors}
              onAddressChange={setDeliveryAddress}
              onPhoneChange={setPhone}
              onNotesChange={setNotes}
            />
          </div>

          {/* RIGHT COLUMN */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary
              itemCount={cart.items.reduce(
                (total, item) => total + item.quantity,
                0
              )}
              subtotal={cart.totalPrice}
              deliveryFee={DELIVERY_FEE}
            />

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 hidden w-full rounded-xl bg-primary px-5 py-4 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 lg:block"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            {errors.cart && (
              <p className="mt-3 text-center text-sm text-destructive">
                {errors.cart}
              </p>
            )}
          </aside>
        </div>
      </div>

      {/* MOBILE CHECKOUT */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t bg-background/95 p-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full rounded-xl bg-primary px-5 py-4 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </main>
  )
}