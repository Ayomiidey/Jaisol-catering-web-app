import Link from 'next/link'
import { FoodCard } from '@/components/shared/FoodCard'

interface PopularDishesProps {
  items: any[]
  onAdd: (item: any) => void
}

export function PopularDishes({ items, onAdd }: PopularDishesProps) {
  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Popular dishes</h3>
        <Link href="/explore" className="text-sm font-semibold text-primary hover:underline">
          View menu
        </Link>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <FoodCard key={item.id} item={item} variant="row" onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}