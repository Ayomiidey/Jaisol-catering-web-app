'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, ShoppingBag, UtensilsCrossed, User } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/order', icon: ShoppingBag, label: 'Order' },
  { href: '/book', icon: UtensilsCrossed, label: 'Book' },
  { href: '/account', icon: User, label: 'Account' },
]

export function BottomNav() {
  const pathname = usePathname()
  const cartCount = useSelector((state: RootState) => state.cart.items.length)

  // Hide nav on auth pages and admin pages
  if (
    pathname.includes('/sign-in') ||
    pathname.includes('/sign-up') ||
    pathname.startsWith('/admin')
  ) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 relative transition ${
                isActive ? 'text-orange-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              {item.href === '/order' && cartCount > 0 && (
                <span className="absolute top-1 right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
