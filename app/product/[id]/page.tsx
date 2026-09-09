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
  Clock3,
  Users,
  ChevronRight,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from '@/lib/slices/cart-slice'
import { useState } from 'react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const id = params.id as string

  const cartItems = useSelector((state: RootState) => state.cart.items)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  const totalCartQuantity = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0
  )

  const handleAdd = () => {
    if (!item) return

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

  const handleDecrease = () => {
    if (!cartItem) return

    if (cartItem.quantity <= 1) {
      dispatch(removeFromCart(cartItem.id))
    } else {
      dispatch(
        updateCartItem({
          id: cartItem.id,
          quantity: cartItem.quantity - 1,
        })
      )
    }
  }

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447000000000'

  const handleWhatsAppEnquiry = () => {
    if (!item) return

    const message = encodeURIComponent(
      `Hi! I'd like to enquire about "${item.name}" (£${Number(
        item.price
      ).toFixed(2)}). Is it available?`
    )

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      '_blank'
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green-light flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="text-center">
            <p className="font-semibold">Preparing your menu...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Just a moment
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-full bg-brand-red-light flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-brand-red" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold">Item not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This menu item may no longer be available.
          </p>
        </div>

        <Link href="/explore">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Menu
          </Button>
        </Link>
      </div>
    )
  }

  const productImages = Array.from(
    new Set([item.imageUrl, ...(item.images ?? [])].filter(Boolean))
  ) as string[]

  const activeImage =
    selectedImage && productImages.includes(selectedImage)
      ? selectedImage
      : productImages[0]

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 lg:pb-12">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Desktop title */}
          <div className="hidden sm:block text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Jaisol Catering
            </p>
            <p className="font-semibold truncate max-w-[300px]">
              {item.name}
            </p>
          </div>

          {/* Cart */}
          <Link
            href="/order"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition"
          >
            <ShoppingCart className="w-5 h-5" />

            {totalCartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                {totalCartQuantity}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-10">
          {/* =================================================
              LEFT — PRODUCT IMAGE
          ================================================= */}
          <section>
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-secondary border border-border/70">
              <div className="aspect-square sm:aspect-[4/3] lg:aspect-square relative">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={item.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="w-20 h-20 text-muted-foreground/30" />
                  </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                {/* Availability */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-brand-red text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg">
                      Currently Unavailable
                    </span>
                  </div>
                )}

                {/* Category */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-dark dark:text-white shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                THUMBNAILS
            ================================================= */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                {productImages.map((image, index) => {
                  const isActive = activeImage === image

                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View image ${index + 1}`}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${item.name} ${index + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* =================================================
              RIGHT — PRODUCT INFORMATION
          ================================================= */}
          <section className="lg:sticky lg:top-24 lg:self-start">
            <div className="py-5 lg:py-0">
              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  {item.category}
                </span>

                <span className="w-1 h-1 rounded-full bg-border" />

                <span className="text-xs text-muted-foreground">
                  West African cuisine
                </span>
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
                {item.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < 4
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-sm font-medium">4.0</span>

                <span className="text-sm text-muted-foreground">
                  Customer favourite
                </span>
              </div>

              {/* Price */}
              <div className="mt-6">
                <span className="text-3xl font-bold text-primary">
                  £{Number(item.price).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <div className="mt-6">
                  <p className="text-base leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-border my-7" />

              {/* =================================================
                  PRODUCT DETAILS
              ================================================= */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-green-light flex items-center justify-center mb-3">
                    <Clock3 className="w-4 h-4 text-primary" />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Preparation
                  </p>

                  <p className="font-semibold mt-1">
                    20–30 min
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-green-light flex items-center justify-center mb-3">
                    <Users className="w-4 h-4 text-primary" />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Serving
                  </p>

                  <p className="font-semibold mt-1">
                    1 person
                  </p>
                </div>
              </div>

              {/* =================================================
                  WHATSAPP
              ================================================= */}
              <button
                onClick={handleWhatsAppEnquiry}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400 py-3.5 px-4 text-sm font-semibold hover:bg-green-600/15 transition"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire about this dish
              </button>

              {/* Desktop Add to Cart */}
              <div className="hidden lg:block mt-4">
                {item.isAvailable ? (
                  quantity > 0 ? (
                    <div className="flex gap-3">
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary px-3">
                        <button
                          onClick={handleDecrease}
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-background transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="font-bold min-w-6 text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={handleAdd}
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-background transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <Link href="/order" className="flex-1">
                        <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base">
                          View Cart
                          <span className="ml-2 opacity-80">·</span>
                          <span className="ml-2">
                            £
                            {(
                              (cartItem?.price ?? item.price) * quantity
                            ).toFixed(2)}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAdd}
                      className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Cart · £{Number(item.price).toFixed(2)}
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full h-14 rounded-xl text-base"
                  >
                    Currently Unavailable
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}
        {relatedItems.length > 0 && (
          <section className="border-t border-border mt-8 lg:mt-4 pt-8 lg:pt-12">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  You may also like
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  More from {item.category}
                </h2>
              </div>

              <Link
                href="/explore"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View menu
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.id}`}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="aspect-square relative bg-secondary overflow-hidden">
                    {rel.imageUrl ? (
                      <Image
                        src={rel.imageUrl}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChefHat className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition">
                      {rel.name}
                    </h3>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="font-bold text-primary">
                        £{Number(rel.price).toFixed(2)}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          MOBILE FIXED CART BAR
      ===================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {item.isAvailable ? (
            quantity > 0 ? (
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center rounded-xl border border-border bg-secondary px-2">
                  <button
                    onClick={handleDecrease}
                    className="w-10 h-11 flex items-center justify-center rounded-lg hover:bg-background transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-bold">
                    {quantity}
                  </span>

                  <button
                    onClick={handleAdd}
                    className="w-10 h-11 flex items-center justify-center rounded-lg hover:bg-background transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* View cart */}
                <Link href="/order" className="flex-1">
                  <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    View Cart · £
                    {(
                      (cartItem?.price ?? item.price) * quantity
                    ).toFixed(2)}
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleAdd}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Cart · £{Number(item.price).toFixed(2)}
              </Button>
            )
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold"
            >
              Currently Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}



// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { getMenuItemById, getMenuItems } from '@/app/actions/menu'
// import { Button } from '@/components/ui/button'
// import {
//   ArrowLeft,
//   Plus,
//   Minus,
//   ShoppingCart,
//   Star,
//   ChefHat,
//   MessageCircle,
// } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/lib/store'
// import { addToCart, removeFromCart, updateCartItem } from '@/lib/slices/cart-slice'
// import { useState } from 'react'

// export default function ProductPage() {
//   const params = useParams()
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const id = params.id as string
//   const cartItems = useSelector((state: RootState) => state.cart.items)
//   const [selectedImage, setSelectedImage] = useState<string | null>(null)

//   const { data: item, isLoading, isError } = useQuery({
//     queryKey: ['menu-item', id],
//     queryFn: () => getMenuItemById(id),
//     enabled: !!id,
//   })

//   const { data: allItems = [] } = useQuery({
//     queryKey: ['menu-items'],
//     queryFn: () => getMenuItems(),
//   })

//   const relatedItems = allItems
//     .filter((i) => i.id !== id && i.category === item?.category)
//     .slice(0, 4)

//   const cartItem = cartItems.find((c) => c.menuItemId === id)
//   const quantity = cartItem?.quantity ?? 0

//   const handleAdd = () => {
//     if (!item) return
//     dispatch(
//       addToCart({
//         menuItemId: item.id,
//         name: item.name,
//         price: item.price,
//         imageUrl: item.imageUrl,
//         quantity: 1,
//       })
//     )
//   }

//   const handleDecrease = () => {
//     if (!cartItem) return
//     if (cartItem.quantity <= 1) {
//       dispatch(removeFromCart(cartItem.id))
//     } else {
//       dispatch(updateCartItem({ id: cartItem.id, quantity: cartItem.quantity - 1 }))
//     }
//   }

//   const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447000000000'

//   const handleWhatsAppEnquiry = () => {
//     if (!item) return
//     const message = encodeURIComponent(
//       `Hi! I'd like to enquire about "${item.name}" (£${item.price.toFixed(2)}). Is it available?`
//     )
//     window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <ChefHat className="w-8 h-8 text-orange-500 animate-pulse" />
//           <p className="text-muted-foreground text-sm">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (isError || !item) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
//         <p className="text-lg font-semibold">Item not found</p>
//         <Link href="/explore">
//           <Button className="bg-orange-500 hover:bg-orange-600">Back to Menu</Button>
//         </Link>
//       </div>
//     )
//   }

//   const productImages = Array.from(new Set([item.imageUrl, ...(item.images ?? [])].filter(Boolean))) as string[]
//   const activeImage = selectedImage && productImages.includes(selectedImage)
//     ? selectedImage
//     : productImages[0]

//   return (
//     <div className="min-h-screen bg-background text-foreground pb-32 lg:pb-24 lg:max-w-7xl lg:mx-auto lg:px-6">
//       {/* Header */}
//       <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between">
//         <button
//           onClick={() => router.back()}
//           className="p-2 hover:bg-secondary rounded-lg transition -ml-2"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <h1 className="text-lg font-semibold truncate max-w-[200px]">{item.name}</h1>
//         <Link href="/order" className="p-2 hover:bg-secondary rounded-lg transition relative">
//           <ShoppingCart className="w-5 h-5" />
//           {cartItems.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
//               {cartItems.reduce((s, i) => s + i.quantity, 0)}
//             </span>
//           )}
//         </Link>
//       </header>

//       {/* Product Image */}
//       <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] bg-secondary overflow-hidden rounded-none lg:rounded-2xl lg:mt-6">
//         {activeImage ? (
//           <Image
//             src={activeImage}
//             alt={item.name}
//             fill
//             className="object-contain p-4 lg:p-8"
//             priority
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <ChefHat className="w-16 h-16 text-muted-foreground/40" />
//           </div>
//         )}
//         {!item.isAvailable && (
//           <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
//             <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
//               Currently Unavailable
//             </span>
//           </div>
//         )}
//       </div>

//       {productImages.length > 1 && (
//         <div className="flex gap-3 overflow-x-auto px-4 py-3 lg:px-0">
//           {productImages.map((image, index) => (
//             <button
//               key={image}
//               type="button"
//               onClick={() => setSelectedImage(image)}
//               className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${activeImage === image ? 'border-orange-500' : 'border-transparent hover:border-orange-500/60'}`}
//               aria-label={`View image ${index + 1}`}
//             >
//               <Image src={image} alt={`${item.name} ${index + 1}`} fill sizes="64px" className="object-cover" />
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Product Info */}
//       <div className="px-4 py-6 space-y-4">
//         {/* Category Badge */}
//         <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold uppercase tracking-wide">
//           {item.category}
//         </span>

//         {/* Name & Price */}
//         <div className="flex items-start justify-between gap-2">
//           <h2 className="text-2xl font-bold leading-tight">{item.name}</h2>
//           <span className="text-2xl font-bold text-orange-500 flex-shrink-0">
//             £{item.price.toFixed(2)}
//           </span>
//         </div>

//         {/* Rating (static for now) */}
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-0.5">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-4 h-4 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-muted-foreground'}`}
//               />
//             ))}
//           </div>
//           <span className="text-sm text-muted-foreground">4.0 · West African cuisine</span>
//         </div>

//         {/* Description */}
//         {item.description && (
//           <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
//         )}

//         {/* Divider */}
//         <div className="border-t border-border" />

//         {/* Preparation Info */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="p-3 rounded-lg bg-secondary">
//             <p className="text-xs text-muted-foreground">Prep time</p>
//             <p className="font-semibold text-sm mt-0.5">20–30 min</p>
//           </div>
//           <div className="p-3 rounded-lg bg-secondary">
//             <p className="text-xs text-muted-foreground">Serves</p>
//             <p className="font-semibold text-sm mt-0.5">1 person</p>
//           </div>
//         </div>

//         {/* WhatsApp Enquiry */}
//         <button
//           onClick={handleWhatsAppEnquiry}
//           className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-green-500/50 bg-green-500/10 text-green-500 font-medium text-sm hover:bg-green-500/20 transition"
//         >
//           <MessageCircle className="w-4 h-4" />
//           Enquire on WhatsApp
//         </button>
//       </div>

//       {/* Related Items */}
//       {relatedItems.length > 0 && (
//         <section className="px-4 py-4 border-t border-border lg:px-0">
//           <h3 className="text-lg font-semibold mb-4">More from {item.category}</h3>
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-2">
//             {relatedItems.map((rel) => (
//               <Link
//                 key={rel.id}
//                 href={`/product/${rel.id}`}
//                 className="rounded-lg overflow-hidden bg-secondary border border-border hover:border-orange-500 transition"
//               >
//                 <div className="aspect-square bg-muted relative">
//                   {rel.imageUrl && (
//                     <Image src={rel.imageUrl} alt={rel.name} fill className="object-cover" />
//                   )}
//                 </div>
//                 <div className="p-2">
//                   <p className="text-xs font-medium truncate">{rel.name}</p>
//                   <p className="text-xs text-orange-500 font-semibold">£{rel.price.toFixed(2)}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Fixed Bottom Add to Cart */}
//       <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-background border-t border-border z-30">
//         {item.isAvailable ? (
//           quantity > 0 ? (
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3 bg-orange-500 rounded-xl px-3 py-2">
//                 <button onClick={handleDecrease} className="p-1 hover:bg-orange-600 rounded transition">
//                   <Minus className="w-4 h-4 text-white" />
//                 </button>
//                 <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
//                 <button onClick={handleAdd} className="p-1 hover:bg-orange-600 rounded transition">
//                   <Plus className="w-4 h-4 text-white" />
//                 </button>
//               </div>
//               <Link href="/order" className="flex-1 ml-3">
//                 <Button className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-6">
//                   View Cart · £{((cartItems.find(c => c.menuItemId === id)?.price ?? item.price) * quantity).toFixed(2)}
//                 </Button>
//               </Link>
//             </div>
//           ) : (
//             <Button
//               onClick={handleAdd}
//               className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-6 text-base"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Add to Cart · £{item.price.toFixed(2)}
//             </Button>
//           )
//         ) : (
//           <Button disabled className="w-full py-6 text-base" variant="outline">
//             Currently Unavailable
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }
