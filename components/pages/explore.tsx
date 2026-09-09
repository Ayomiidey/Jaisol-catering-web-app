'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  Plus,
  Minus,
  Search,
  X,
  ShoppingBag,
} from 'lucide-react'

import { getMenuItems } from '@/app/actions/menu'
import { RootState } from '@/lib/store'

import {
  setCategory,
  clearFilters,
} from '@/lib/slices/filter-slice'

import {
  addToCart,
  removeFromCart,
} from '@/lib/slices/cart-slice'

export function Explore() {
  const dispatch = useDispatch()

  const selectedCategory = useSelector(
    (state: RootState) => state.filters.selectedCategory
  )

  const searchTerm = useSelector(
    (state: RootState) => state.filters.searchTerm
  )

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  )

  const [localSearch, setLocalSearch] = useState('')

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  })

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        menuItems
          .map((item) => item.category)
          .filter(Boolean)
      )
    )
  }, [menuItems])

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory =
        !selectedCategory ||
        item.category === selectedCategory

      const search = localSearch || searchTerm

      const matchSearch =
        !search ||
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [
    menuItems,
    selectedCategory,
    localSearch,
    searchTerm,
  ])

  const getCartQuantity = (menuItemId: string) => {
    return cartItems
      .filter(
        (item) =>
          item.menuItemId === menuItemId
      )
      .reduce(
        (sum, item) => sum + item.quantity,
        0
      )
  }

  const handleAddToCart = (
    item: any,
    event?: React.MouseEvent
  ) => {
    event?.preventDefault()
    event?.stopPropagation()

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

  const handleRemoveFromCart = (
    menuItemId: string,
    event?: React.MouseEvent
  ) => {
    event?.preventDefault()
    event?.stopPropagation()

    const cartItem = cartItems.find(
      (item) =>
        item.menuItemId === menuItemId
    )

    if (cartItem) {
      dispatch(
        removeFromCart(cartItem.id)
      )
    }
  }

  const handleClearSearch = () => {
    setLocalSearch('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">

        <div className="mx-auto max-w-7xl px-4 md:px-6">

          <div className="flex items-center justify-between py-4">

            <Link
              href="/"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-border
                bg-card
                transition
                hover:bg-secondary
                hover:border-primary/30
              "
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="text-center">
              <h1 className="text-lg font-bold tracking-tight md:text-xl">
                Explore our menu
              </h1>

              <p className="text-xs text-muted-foreground">
                Freshly prepared, made with flavour
              </p>
            </div>

            <Link
              href="/cart"
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-full
                border border-border
                bg-card
                transition
                hover:bg-secondary
              "
              aria-label="View cart"
            >
              <ShoppingBag className="h-5 w-5" />

              {cartItems.length > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex h-5 min-w-5
                    items-center justify-center
                    rounded-full
                    bg-primary
                    px-1
                    text-[10px]
                    font-bold
                    text-primary-foreground
                  "
                >
                  {cartItems.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}
                </span>
              )}
            </Link>

          </div>


          {/* ================= SEARCH ================= */}

          <div className="relative pb-4">

            <Search
              className="
                pointer-events-none
                absolute left-4 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <input
              type="text"
              placeholder="Search for your favourite food..."
              value={localSearch}
              onChange={(e) =>
                setLocalSearch(e.target.value)
              }
              className="
                h-12 w-full
                rounded-2xl
                border border-border
                bg-card
                pl-11 pr-11
                text-sm
                text-foreground
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-4
                focus:ring-primary/10
              "
            />

            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="
                  absolute right-3 top-1/2
                  flex h-7 w-7
                  -translate-y-1/2
                  items-center justify-center
                  rounded-full
                  text-muted-foreground
                  transition
                  hover:bg-secondary
                  hover:text-foreground
                "
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

          </div>

        </div>

      </header>


      {/* ================= CATEGORY FILTER ================= */}

      <section
        className="
          sticky top-[137px]
          z-20
          border-b border-border/70
          bg-background/95
          py-3
          backdrop-blur-xl
        "
      >

        <div className="mx-auto max-w-7xl">

          <div
            className="
              flex gap-2
              overflow-x-auto
              px-4
              scrollbar-hide
              md:px-6
            "
          >

            {['All', ...categories].map((category) => {

              const isActive =
                (category === 'All' &&
                  !selectedCategory) ||
                selectedCategory === category

              return (
                <button
                  key={category}
                  onClick={() => {
                    if (category === 'All') {
                      dispatch(clearFilters())
                    } else {
                      dispatch(
                        setCategory(category)
                      )
                    }
                  }}
                  className={`
                    flex-shrink-0
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-primary
                          text-primary-foreground
                          shadow-sm
                        `
                        : `
                          border border-border
                          bg-card
                          text-muted-foreground
                          hover:border-primary/30
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {category}
                </button>
              )
            })}

          </div>

        </div>

      </section>


      {/* ================= MENU ================= */}

      <main className="mx-auto max-w-7xl px-4 py-7 md:px-6">

        {/* Title */}

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-1 text-sm font-medium text-primary">
              OUR MENU
            </p>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {selectedCategory || 'All dishes'}
            </h2>

          </div>

          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {filtered.length}{' '}
              {filtered.length === 1
                ? 'item'
                : 'items'}
            </span>
          )}

        </div>


        {/* ================= LOADING ================= */}

        {isLoading && (

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">

            {[...Array(6)].map((_, index) => (

              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-3xl
                  border border-border
                  bg-card
                "
              >

                <div className="aspect-[4/4.5] animate-pulse bg-muted" />

                <div className="space-y-3 p-4">

                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />

                  <div className="h-8 w-full animate-pulse rounded-xl bg-muted" />

                </div>

              </div>

            ))}

          </div>

        )}


        {/* ================= PRODUCTS ================= */}

        {!isLoading && filtered.length > 0 && (

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              md:grid-cols-3
              md:gap-5
            "
          >

            {filtered.map((item) => {

              const quantity =
                getCartQuantity(item.id)

              return (

                <div
                  key={item.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border border-border
                    bg-card
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-primary/30
                    hover:shadow-xl
                  "
                >

                  {/* IMAGE */}

                  <Link
                    href={`/product/${item.id}`}
                    className="block"
                  >

                    <div
                      className="
                        relative
                        aspect-[4/4.2]
                        overflow-hidden
                        bg-muted
                      "
                    >

                      {item.imageUrl ? (

                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="
                            (max-width: 768px) 50vw,
                            (max-width: 1280px) 33vw,
                            400px
                          "
                          className="
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex h-full
                            items-center
                            justify-center
                            text-sm
                            text-muted-foreground
                          "
                        >
                          No image
                        </div>

                      )}

                    </div>

                  </Link>


                  {/* CONTENT */}

                  <div className="flex flex-col p-3 sm:p-4">

                    {/* CATEGORY */}

                    {item.category && (

                      <p
                        className="
                          mb-1
                          truncate
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                          sm:text-xs
                        "
                      >
                        {item.category}
                      </p>

                    )}


                    {/* PRODUCT NAME */}

                    <Link
                      href={`/product/${item.id}`}
                    >

                      <h3
                        className="
                          min-h-[2.5rem]
                          line-clamp-2
                          text-sm
                          font-bold
                          leading-snug
                          transition-colors
                          group-hover:text-primary
                          sm:text-base
                        "
                      >
                        {item.name}
                      </h3>

                    </Link>


                    {/* DESCRIPTION */}

                    {item.description && (

                      <p
                        className="
                          mt-1
                          hidden
                          line-clamp-1
                          text-xs
                          text-muted-foreground
                          sm:block
                        "
                      >
                        {item.description}
                      </p>

                    )}


                    {/* PRICE + CART */}

                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                    >

                      <span
                        className="
                          text-sm
                          font-bold
                          text-primary
                          sm:text-base
                        "
                      >
                        £{item.price.toFixed(2)}
                      </span>


                      {/* QUANTITY CONTROL */}

                      {quantity > 0 ? (

                        <div
                          className="
                            flex
                            items-center
                            overflow-hidden
                            rounded-xl
                            bg-primary
                            text-primary-foreground
                          "
                        >

                          <button
                            onClick={(event) =>
                              handleRemoveFromCart(
                                item.id,
                                event
                              )
                            }
                            className="
                              flex
                              h-8 w-8
                              items-center
                              justify-center
                              transition
                              hover:bg-black/10
                            "
                            aria-label={`Remove ${item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span
                            className="
                              flex
                              min-w-7
                              justify-center
                              text-xs
                              font-bold
                            "
                          >
                            {quantity}
                          </span>

                          <button
                            onClick={(event) =>
                              handleAddToCart(
                                item,
                                event
                              )
                            }
                            className="
                              flex
                              h-8 w-8
                              items-center
                              justify-center
                              transition
                              hover:bg-black/10
                            "
                            aria-label={`Add another ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>

                        </div>

                      ) : (

                        <button
                          onClick={(event) =>
                            handleAddToCart(
                              item,
                              event
                            )
                          }
                          className="
                            flex
                            h-9 w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary
                            text-primary-foreground
                            shadow-sm
                            transition-all
                            hover:scale-105
                            hover:bg-primary/90
                            active:scale-95
                          "
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              )

            })}

          </div>

        )}


        {/* ================= EMPTY STATE ================= */}

        {!isLoading &&
          filtered.length === 0 && (

            <div
              className="
                flex
                min-h-[350px]
                flex-col
                items-center
                justify-center
                rounded-3xl
                border border-dashed
                border-border
                bg-card
                px-6
                text-center
              "
            >

              <div
                className="
                  mb-4
                  flex h-14 w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                  text-primary
                "
              >
                <Search className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold">
                No dishes found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                We couldn't find anything matching your search.
                Try another dish or category.
              </p>

              <button
                onClick={() => {
                  setLocalSearch('')
                  dispatch(clearFilters())
                }}
                className="
                  mt-5
                  rounded-full
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-primary-foreground
                  transition
                  hover:bg-primary/90
                "
              >
                Reset filters
              </button>

            </div>

          )}

      </main>

    </div>
  )
}




// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import Image from 'next/image'
// import { getMenuItems } from '@/app/actions/menu'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft, Plus, Minus } from 'lucide-react'
// import Link from 'next/link'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/lib/store'
// import { setCategory, setSearchTerm, clearFilters } from '@/lib/slices/filter-slice'
// import { addToCart, removeFromCart, updateCartItem } from '@/lib/slices/cart-slice'
// import { useState } from 'react'

// export function Explore() {
//   const dispatch = useDispatch()
//   const selectedCategory = useSelector((state: RootState) => state.filters.selectedCategory)
//   const searchTerm = useSelector((state: RootState) => state.filters.searchTerm)
//   const cartItems = useSelector((state: RootState) => state.cart.items)
//   const [localSearch, setLocalSearch] = useState('')

//   const { data: menuItems = [] } = useQuery({
//     queryKey: ['menu-items'],
//     queryFn: () => getMenuItems(),
//   })

//   const categories = Array.from(new Set(menuItems.map((item) => item.category)))

//   const filtered = menuItems.filter((item) => {
//     const matchCategory = !selectedCategory || item.category === selectedCategory
//     const search = localSearch || searchTerm
//     const matchSearch =
//       !search ||
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.description?.toLowerCase().includes(search.toLowerCase())
//     return matchCategory && matchSearch
//   })

//   const getCartQuantity = (menuItemId: string) => {
//     const items = cartItems.filter((item) => item.menuItemId === menuItemId)
//     return items.reduce((sum, item) => sum + item.quantity, 0)
//   }

//   const handleAddToCart = (item: any) => {
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

//   const handleRemoveFromCart = (menuItemId: string) => {
//     const cartItem = cartItems.find((item) => item.menuItemId === menuItemId)
//     if (cartItem) {
//       dispatch(removeFromCart(cartItem.id))
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground pb-24">
//       {/* Header */}
//       <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
//         <div className="flex items-center justify-between mb-4">
//           <Link href="/" className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
//             <ArrowLeft className="w-5 h-5" />
//           </Link>
//           <h1 className="text-xl font-bold">Menu</h1>
//           <div className="w-10" />
//         </div>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search menu..."
//           value={localSearch}
//           onChange={(e) => setLocalSearch(e.target.value)}
//           className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-orange-500"
//         />
//       </header>

//       {/* Category Filter */}
//       <section className="px-4 py-3 flex gap-2 overflow-x-auto pb-2 border-b border-border sticky top-[80px] z-10 bg-background">
//         {['All', ...categories].map((cat) => (
//           <button
//             key={cat}
//             onClick={() => {
//               if (cat === 'All') {
//                 dispatch(clearFilters())
//               } else {
//                 dispatch(setCategory(cat))
//               }
//             }}
//             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
//               (cat === 'All' && !selectedCategory) || selectedCategory === cat
//                 ? 'bg-orange-500 text-white'
//                 : 'bg-secondary hover:bg-secondary/80 text-foreground'
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </section>

//       {/* Menu Items Grid */}
//       <section className="px-4 py-4">
//         <div className="grid grid-cols-2 gap-3">
//           {filtered.map((item) => {
//             const quantity = getCartQuantity(item.id)
//             return (
//               <Link key={item.id} href={`/product/${item.id}`}>
//                 <div className="rounded-lg bg-secondary border border-border overflow-hidden hover:border-orange-500 transition cursor-pointer h-full flex flex-col">
//                   <div className="aspect-square bg-muted flex items-center justify-center relative">
//                     {item.imageUrl && (
//                       <Image
//                         src={item.imageUrl}
//                         alt={item.name}
//                         fill
//                         className="object-cover"
//                       />
//                     )}
//                   </div>
//                   <div className="p-3 flex-1 flex flex-col justify-between">
//                     <div>
//                       <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
//                       {item.description && (
//                         <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between mt-3" onClick={(e) => e.preventDefault()}>
//                       <span className="font-bold text-orange-500">£{item.price.toFixed(2)}</span>
//                       {quantity > 0 ? (
//                       <div className="flex items-center gap-2 bg-orange-500 rounded-lg">
//                         <button
//                           onClick={() => handleRemoveFromCart(item.id)}
//                           className="p-1 hover:bg-orange-600 transition"
//                         >
//                           <Minus className="w-3 h-3 text-white" />
//                         </button>
//                         <span className="text-xs font-bold text-white w-6 text-center">{quantity}</span>
//                         <button
//                           onClick={() => handleAddToCart(item)}
//                           className="p-1 hover:bg-orange-600 transition"
//                         >
//                           <Plus className="w-3 h-3 text-white" />
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleAddToCart(item)}
//                         className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
//                       >
//                         <Plus className="w-4 h-4 text-white" />
//                       </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             )
//           })}
//         </div>

//         {filtered.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-12">
//             <p className="text-muted-foreground">No items found</p>
//           </div>
//         )}
//       </section>
//     </div>
//   )
// }
