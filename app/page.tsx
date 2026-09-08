'use client'

import { useQuery } from '@tanstack/react-query'
import { getMenuItems } from '@/app/actions/menu'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { RootState } from '@/lib/store'
import { addToCart } from '@/lib/slices/cart-slice'
import HeroCarousel from '@/components/carousel/HeroCarousel'
import { HomeHeader } from '@/components/home/HomeHeader'
import { QuickActions } from '@/components/home/QuickActions'
import { KitchenSection } from '@/components/home/KitchenSection'
import { PopularDishes } from '@/components/home/PopularDishes'
import { CateringBanner } from '@/components/home/CateringBanner'
import { ReviewsSection } from '@/components/home/ReviewsSection'

export default function Home() {
  const { data: session } = useSession()
  const greeting = `Hi, ${session?.user?.name?.split(' ')[0] || 'there'}`
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  })

  const featuredItems = menuItems.slice(0, 3)
  const popularItems = menuItems.slice(0, 3)

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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <HomeHeader greeting={greeting} cartCount={cartCount} />
      <section className="px-4 py-4">
        <HeroCarousel />
      </section>
      <QuickActions />
      <KitchenSection items={featuredItems} />
      <PopularDishes items={popularItems} onAdd={handleAddToCart} />
      <CateringBanner />
      <ReviewsSection />
    </div>
  )
}