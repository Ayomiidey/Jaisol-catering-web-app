import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FoodCard } from '@/components/shared/FoodCard'

interface KitchenSectionProps {
  items: any[]
}

export function KitchenSection({ items }: KitchenSectionProps) {
  return (
    <section className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">From the kitchen</h3>
        <Link href="/explore" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          See all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible">
        {items.map((item) => (
          <FoodCard key={item.id} item={item} variant="grid" />
        ))}
      </div>
    </section>
  )
}