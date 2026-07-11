'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Compass, Home, ShoppingBag, UtensilsCrossed, User } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/order', label: 'Order', icon: ShoppingBag },
  { href: '/book', label: 'Book', icon: UtensilsCrossed },
  { href: '/account', label: 'Account', icon: User },
]

export function DesktopHeader() {
  const pathname = usePathname()

  if (
    pathname.startsWith('/admin') ||
    pathname.includes('/sign-in') ||
    pathname.includes('/sign-up')
  ) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 hidden lg:block border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/placeholder-logo.png"
            alt="Jaisol Catering logo"
            width={42}
            height={42}
            className="rounded-xl object-cover shadow-sm"
            priority
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-500 font-semibold">
              Authentic West African Catering
            </p>
            <h1 className="text-xl font-semibold leading-tight">Jaisol Catering</h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <Link href="/book" className="ml-2">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5">
              Reserve catering
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}