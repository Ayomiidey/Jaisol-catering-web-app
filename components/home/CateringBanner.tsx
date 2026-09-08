import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CateringBanner() {
  return (
    <section className="px-4 py-6">
      <div className="rounded-3xl bg-navy text-navy-foreground p-6 relative overflow-hidden">
        <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          Limited dates
        </span>
        <h3 className="text-xl font-bold mb-1">Catering slots open</h3>
        <p className="text-sm text-white/70 mb-4">August & September · Weddings, birthdays, corporate events</p>
        <Link href="/book">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
            Reserve your date
          </Button>
        </Link>
      </div>
    </section>
  )
}