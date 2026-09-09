import {
  Leaf,
  ChefHat,
  Truck,
  Heart,
} from 'lucide-react'

const benefits = [
  {
    icon: Leaf,
    title: 'Fresh ingredients',
    text: 'Quality ingredients prepared with care.',
  },
  {
    icon: ChefHat,
    title: 'Authentic recipes',
    text: 'Traditional flavours inspired by West Africa.',
  },
  {
    icon: Truck,
    title: 'Reliable delivery',
    text: 'Convenient delivery and collection options.',
  },
  {
    icon: Heart,
    title: 'Made with care',
    text: 'Every order matters to us.',
  },
]

export function WhyJaisolSection() {
  return (
    <section className="bg-[#EEF6E5] py-20 lg:py-24 px-5 lg:px-8">

      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-14">

          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#5D9F32] mb-3">
            Why Jaisol
          </p>

          <h2 className="font-serif text-4xl lg:text-5xl">
            Quality. Freshness. Trust.
          </h2>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon

            return (
              <div
                key={benefit.title}
                className={`
                  text-center px-5 py-7
                  ${index !== 0 ? 'lg:border-l border-[#5D9F32]/25' : ''}
                `}
              >

                <div className="mx-auto w-14 h-14 rounded-full bg-white flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#5D9F32]" />
                </div>

                <h3 className="font-semibold text-sm mb-2">
                  {benefit.title}
                </h3>

                <p className="text-xs leading-5 text-[#171922]/55 max-w-[180px] mx-auto">
                  {benefit.text}
                </p>

              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}