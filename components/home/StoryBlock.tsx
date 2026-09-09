// StoryBlock.tsx
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function StoryBlock() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 bg-secondary">
      <div className="relative h-64 lg:h-150 order-2 lg:order-2">
        <Image src="/images/egusi-soup.png" alt="Our story" fill className="object-cover" />
      </div>
      <div className="p-8 sm:p-12 flex flex-col justify-center order-1 lg:order-2">
        <span className="text-primary text-xs font-bold tracking-wide">OUR STORY</span>
        <h2 className="font-display text-2xl sm:text-3xl mt-2 mb-4">Food that brings people together</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          At Jaisol Catering, we believe food is more than a meal — it's how we
          celebrate, show love, and create lasting memories.
        </p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-full font-bold w-fit px-6">
          Learn more
        </Button>
      </div>
    </section>
  )
}