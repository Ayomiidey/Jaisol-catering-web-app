import Link from 'next/link'
import { ReviewCard } from '@/components/shared/ReviewCard'

const reviews = [
  { name: 'Tolu A.', text: 'Absolutely loved the catering! The food was authentic and delicious.' },
  { name: 'Sarah K.', text: "Best jollof rice I've had outside of West Africa!" },
]

export function ReviewsSection() {
  return (
    <section className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">What people say</h3>
        <Link href="/explore" className="text-sm font-semibold text-primary hover:underline">
          Order now
        </Link>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <ReviewCard key={r.name} name={r.name} text={r.text} />
        ))}
      </div>
    </section>
  )
}