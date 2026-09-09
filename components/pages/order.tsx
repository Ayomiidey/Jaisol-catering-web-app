'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import {
  removeFromCart,
  updateCartItem,
  clearCart,
  setDeliveryInfo,
} from '@/lib/slices/cart-slice'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export function Order() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session, status } = useSession()

  const cart = useSelector((state: RootState) => state.cart)

  const [deliveryAddress, setDeliveryAddress] = useState(
    cart.deliveryAddress || ''
  )
  const [phone, setPhone] = useState(cart.phone || '')
  const [notes, setNotes] = useState(cart.specialNotes || '')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const deliveryFee = 2.5
  const orderTotal = cart.totalPrice + deliveryFee

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
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent('/order')}`
      )
      return
    }

    setLoading(true)

    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          totalPrice: orderTotal,
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        if (orderResponse.status === 401) {
          router.push(
            `/sign-in?callbackUrl=${encodeURIComponent('/order')}`
          )
          return
        }

        setErrors({
          submit: orderData.error || 'Failed to create order',
        })

        setLoading(false)
        return
      }

      const itemsList = cart.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join('\n')

      const message = `
📦 *New Order Placed*

*Order ID:* ${orderData.order.id}
*Total:* £${orderTotal.toFixed(2)}

*Items:*
${itemsList}

*Delivery Address:* ${deliveryAddress}
*Phone:* ${phone}
*Special Notes:* ${notes || 'None'}

Status: Pending confirmation
      `.trim()

      const encodedMessage = encodeURIComponent(message)

      const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

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

      setErrors({
        submit: 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  /* =========================================================
     SUCCESS STATE
  ========================================================= */

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-brand-green-light flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-3xl font-bold mt-6">
            Order Confirmed!
          </h2>

          <p className="text-muted-foreground mt-3 leading-relaxed">
            Thank you for ordering from Jaisol Catering.
            Your order has been placed successfully.
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Your order is now being reviewed and you will receive
            confirmation shortly.
          </div>

          <Link href="/">
            <Button className="mt-6 w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 lg:pb-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">

          <Link
            href="/explore"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="ml-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Jaisol Catering
            </p>

            <h1 className="font-bold text-lg leading-tight">
              Your Order
              {itemCount > 0 && (
                <span className="text-muted-foreground font-medium">
                  {' '}({itemCount})
                </span>
              )}
            </h1>
          </div>
        </div>
      </header>

      {/* =====================================================
          EMPTY CART
      ===================================================== */}

      {cart.items.length === 0 ? (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">

            <div className="mx-auto w-20 h-20 rounded-3xl bg-brand-green-light flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Your cart is empty
            </h2>

            <p className="text-muted-foreground mt-2 leading-relaxed">
              Add some delicious dishes to your order and
              come back here when you're ready to checkout.
            </p>

            <Link href="/explore">
              <Button className="mt-6 h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                Explore Menu
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

          {/* =================================================
              DESKTOP PAGE INTRO
          ================================================= */}

          <div className="mb-8 hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Checkout
            </p>

            <h2 className="text-3xl font-bold mt-1">
              Complete your order
            </h2>

            <p className="text-muted-foreground mt-2">
              Review your dishes and provide your delivery details.
            </p>
          </div>

          {/* =================================================
              TWO COLUMN LAYOUT
          ================================================= */}

          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-8">

              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      Your selection
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      Order Items
                    </h2>
                  </div>

                  <Link
                    href="/explore"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Add more
                  </Link>
                </div>

                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-card p-3 sm:p-4"
                    >
                      <div className="flex gap-3">

                        {/* Product image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-bold truncate">
                                {item.name}
                              </h3>

                              <p className="text-sm text-muted-foreground mt-1">
                                £{Number(item.price).toFixed(2)} each
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                dispatch(removeFromCart(item.id))
                              }
                              className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">

                            <span className="font-bold text-primary">
                              £
                              {(
                                item.price * item.quantity
                              ).toFixed(2)}
                            </span>

                            {/* Quantity */}
                            <div className="flex items-center rounded-xl bg-secondary border border-border">

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      quantity: Math.max(
                                        1,
                                        item.quantity - 1
                                      ),
                                    })
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-8 text-center text-sm font-bold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* =================================================
                  DELIVERY INFORMATION
              ================================================= */}

              <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">

                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      Delivery
                    </p>

                    <h2 className="text-xl font-bold mt-0.5">
                      Delivery Information
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">

                  {/* Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-semibold"
                    >
                      Delivery Address *
                    </Label>

                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your full delivery address"
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value)

                        if (errors.address) {
                          setErrors({
                            ...errors,
                            address: '',
                          })
                        }
                      }}
                      className={`h-12 rounded-xl bg-secondary border-border ${
                        errors.address
                          ? 'border-destructive focus-visible:ring-destructive'
                          : 'focus-visible:border-primary'
                      }`}
                    />

                    {errors.address && (
                      <p className="text-sm text-destructive">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="font-semibold"
                    >
                      Phone Number *
                    </Label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)

                          if (errors.phone) {
                            setErrors({
                              ...errors,
                              phone: '',
                            })
                          }
                        }}
                        className={`h-12 rounded-xl bg-secondary border-border pl-10 ${
                          errors.phone
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'focus-visible:border-primary'
                        }`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="font-semibold"
                    >
                      Special Instructions
                      <span className="text-muted-foreground font-normal ml-1">
                        (Optional)
                      </span>
                    </Label>

                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />

                      <textarea
                        id="notes"
                        placeholder="Any dietary requirements or delivery instructions?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full min-h-[110px] pl-10 pr-3 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none text-sm"
                        rows={4}
                      />
                    </div>
                  </div>

                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT COLUMN — SUMMARY
            ================================================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start mt-8 lg:mt-0">

              <div className="rounded-2xl border border-border bg-card overflow-hidden">

                {/* Summary heading */}
                <div className="p-5 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    Summary
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    Order Summary
                  </h2>
                </div>

                {/* Summary content */}
                <div className="p-5 space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Items ({itemCount})
                    </span>

                    <span className="font-medium">
                      £{cart.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery
                    </span>

                    <span className="font-medium">
                      £{deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total
                      </p>

                      <p className="text-2xl font-bold mt-0.5">
                        £{orderTotal.toFixed(2)}
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground mb-1">
                      GBP
                    </span>
                  </div>

                  {/* Desktop checkout */}
                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="hidden lg:flex w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base"
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        Confirm Order
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {errors.submit && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                      <p className="text-sm text-destructive text-center">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    By confirming your order, you agree to our
                    ordering and delivery process.
                  </p>
                </div>
              </div>

              {/* Secure/help message */}
              <div className="hidden lg:flex items-center gap-3 mt-4 px-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>

                <p className="text-xs text-muted-foreground">
                  Your order details are securely submitted
                  for confirmation.
                </p>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* =====================================================
          MOBILE FIXED CHECKOUT
      ===================================================== */}

      {cart.items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3">
          <div className="max-w-2xl mx-auto">

            {errors.submit && (
              <p className="text-center text-sm text-destructive mb-2">
                {errors.submit}
              </p>
            )}

            <div className="flex items-center gap-3">

              <div className="shrink-0">
                <p className="text-[11px] text-muted-foreground">
                  Total
                </p>

                <p className="font-bold text-lg">
                  £{orderTotal.toFixed(2)}
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    Confirm Order
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




// 'use client'

// import { useSelector, useDispatch } from 'react-redux'
// import { RootState } from '@/lib/store'
// import { removeFromCart, updateCartItem, clearCart, setDeliveryInfo } from '@/lib/slices/cart-slice'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import Image from 'next/image'

// export function Order() {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { data: session, status } = useSession()
//   const cart = useSelector((state: RootState) => state.cart)
//   const [deliveryAddress, setDeliveryAddress] = useState(cart.deliveryAddress || '')
//   const [phone, setPhone] = useState(cart.phone || '')
//   const [notes, setNotes] = useState(cart.specialNotes || '')
//   const [submitted, setSubmitted] = useState(false)
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [loading, setLoading] = useState(false)

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!deliveryAddress || deliveryAddress.trim().length === 0) {
//       newErrors.address = 'Delivery address is required'
//     } else if (deliveryAddress.trim().length < 5) {
//       newErrors.address = 'Please enter a valid address'
//     }

//     if (!phone || phone.trim().length === 0) {
//       newErrors.phone = 'Phone number is required'
//     } else if (phone.trim().length < 10) {
//       newErrors.phone = 'Please enter a valid phone number'
//     }

//     if (cart.items.length === 0) {
//       newErrors.cart = 'Your cart is empty'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleCheckout = async () => {
//     if (!validateForm()) {
//       return
//     }

//     if (status !== 'authenticated' || !session?.user) {
//       router.push(`/sign-in?callbackUrl=${encodeURIComponent('/order')}`)
//       return
//     }

//     setLoading(true)

//     try {
//       // Create order in database
//       const orderResponse = await fetch('/api/orders/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           items: cart.items,
//           totalPrice: cart.totalPrice + 2.5,
//           deliveryAddress: deliveryAddress.trim(),
//           phone: phone.trim(),
//           notes: notes.trim(),
//         }),
//       })

//       const orderData = await orderResponse.json()

//       if (!orderResponse.ok) {
//         if (orderResponse.status === 401) {
//           router.push(`/sign-in?callbackUrl=${encodeURIComponent('/order')}`)
//           return
//         }

//         setErrors({ submit: orderData.error || 'Failed to create order' })
//         setLoading(false)
//         return
//       }

//       // Send WhatsApp notification
//       const itemsList = cart.items
//         .map((item) => `${item.quantity}x ${item.name}`)
//         .join('\n')

//       const message = `
// 📦 *New Order Placed*

// *Order ID:* ${orderData.order.id}
// *Total:* £${(cart.totalPrice + 2.5).toFixed(2)}

// *Items:*
// ${itemsList}

// *Delivery Address:* ${deliveryAddress}
// *Phone:* ${phone}
// *Special Notes:* ${notes || 'None'}

// Status: Pending confirmation
//       `.trim()

//       const encodedMessage = encodeURIComponent(message)
//       const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
//       const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
//       window.open(whatsappUrl, '_blank')

//       dispatch(
//         setDeliveryInfo({
//           deliveryAddress,
//           phone,
//           specialNotes: notes,
//         })
//       )

//       setSubmitted(true)
//       setTimeout(() => {
//         dispatch(clearCart())
//         setSubmitted(false)
//         setDeliveryAddress('')
//         setPhone('')
//         setNotes('')
//       }, 2000)
//     } catch (error) {
//       console.error('Error creating order:', error)
//       setErrors({ submit: 'An error occurred. Please try again.' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (submitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <div className="text-6xl">✅</div>
//           <h2 className="text-2xl font-bold">Order Confirmed!</h2>
//           <p className="text-muted-foreground">Your order has been placed successfully.</p>
//           <p className="text-sm text-muted-foreground">You will receive a confirmation email shortly.</p>
//           <Link href="/">
//             <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Home</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground pb-24">
//       {/* Header */}
//       <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
//         <div className="flex items-center gap-4">
//           <Link href="/explore" className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
//             <ArrowLeft className="w-5 h-5" />
//           </Link>
//           <h1 className="text-xl font-bold">Your Order ({cart.items.reduce((total, item) => total + item.quantity, 0)})</h1>
//         </div>
//       </header>

//       {cart.items.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-12 px-4">
//           <p className="text-muted-foreground mb-4">Your cart is empty</p>
//           <Link href="/explore">
//             <Button className="bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
//           </Link>
//         </div>
//       ) : (
//         <>
//           {/* Cart Items */}
//           <section className="px-4 py-6 space-y-3">
//             <h2 className="text-lg font-semibold">Order Items</h2>
//             {cart.items.map((item) => (
//               <div key={item.id} className="p-4 rounded-lg bg-secondary border border-border">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex flex-1 min-w-0 items-center gap-3">
//                     <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
//                       {item.imageUrl ? (
//                         <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No image</div>
//                       )}
//                     </div>
//                     <div className="min-w-0">
//                       <h3 className="font-semibold truncate">{item.name}</h3>
//                       <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => dispatch(removeFromCart(item.id))}
//                     className="p-2 hover:bg-destructive/20 rounded-lg transition"
//                   >
//                     <Trash2 className="w-4 h-4 text-destructive" />
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="font-semibold text-orange-500">
//                     £{(item.price * item.quantity).toFixed(2)}
//                   </span>
//                   <div className="flex items-center gap-2 bg-orange-500 rounded-lg">
//                     <button
//                       onClick={() =>
//                         dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }))
//                       }
//                       className="p-1 hover:bg-orange-600 transition"
//                     >
//                       <Minus className="w-3 h-3 text-white" />
//                     </button>
//                     <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
//                     <button
//                       onClick={() =>
//                         dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }))
//                       }
//                       className="p-1 hover:bg-orange-600 transition"
//                     >
//                       <Plus className="w-3 h-3 text-white" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </section>

//           {/* Delivery Information */}
//           <section className="px-4 py-6 space-y-4 border-t border-border">
//             <h2 className="text-lg font-semibold">Delivery Information</h2>

//             <div className="space-y-2">
//               <Label htmlFor="address">Delivery Address *</Label>
//               <Input
//                 id="address"
//                 type="text"
//                 placeholder="Enter your delivery address"
//                 value={deliveryAddress}
//                 onChange={(e) => {
//                   setDeliveryAddress(e.target.value)
//                   if (errors.address) setErrors({ ...errors, address: '' })
//                 }}
//                 className={`bg-secondary border-border ${errors.address ? 'border-red-500 border-2' : ''}`}
//               />
//               {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number *</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="Your phone number"
//                 value={phone}
//                 onChange={(e) => {
//                   setPhone(e.target.value)
//                   if (errors.phone) setErrors({ ...errors, phone: '' })
//                 }}
//                 className={`bg-secondary border-border ${errors.phone ? 'border-red-500 border-2' : ''}`}
//               />
//               {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="notes">Special Instructions (Optional)</Label>
//               <textarea
//                 id="notes"
//                 placeholder="Any special dietary requirements or delivery instructions?"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 resize-none"
//                 rows={3}
//               />
//             </div>
//           </section>

//           {/* Order Summary */}
//           <section className="px-4 py-6 border-t border-border space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span>£{cart.totalPrice.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Delivery Fee</span>
//               <span>£2.50</span>
//             </div>
//             <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
//               <span>Total</span>
//               <span className="text-orange-500">£{(cart.totalPrice + 2.5).toFixed(2)}</span>
//             </div>
//           </section>

//           {/* Checkout Button */}
//           <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-background border-t border-border">
//             <Button
//               onClick={handleCheckout}
//               disabled={loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 disabled:opacity-50"
//             >
//               {loading ? 'Processing...' : 'Confirm Order'}
//             </Button>
//             {errors.submit && <p className="mt-2 text-center text-sm text-red-400">{errors.submit}</p>}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
