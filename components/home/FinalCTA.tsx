import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#9ED061] px-5 lg:px-8 py-20 lg:py-24">

      {/* Decorative shapes */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#5D9F32]/20" />

      <div className="relative max-w-4xl mx-auto text-center">

        <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#355D20] mb-4">
          Ready to order?
        </p>

        <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] text-[#171922] mb-5">
          Let's make your next
          <br />
          occasion special.
        </h2>

        <p className="text-[#171922]/60 max-w-lg mx-auto mb-8">
          Great food, happy people and memorable moments.
          That's Jaisol.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#DA231D] text-white font-semibold text-sm hover:bg-[#B91D18] transition"
          >
            Book catering
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#171922]/30 text-[#171922] font-semibold text-sm hover:bg-white/40 transition"
          >
            Order food
          </Link>

        </div>

      </div>
    </section>
  )
}