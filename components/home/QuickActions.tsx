import Link from 'next/link'
import { ShoppingCart, UtensilsCrossed, Cake } from 'lucide-react'

const quickActions = [
  { href: '/explore', icon: ShoppingCart, label: 'Order food' },
  { href: '/book', icon: UtensilsCrossed, label: 'Book catering' },
  { href: '/explore', icon: Cake, label: 'Custom cakes' },
]

export function QuickActions() {
  return (
    <section className="px-4 py-2">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {quickActions.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-2 flex-shrink-0 pl-3 pr-4 py-2.5 rounded-full bg-secondary border border-border hover:border-primary hover:bg-primary/10 transition"
          >
            <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}