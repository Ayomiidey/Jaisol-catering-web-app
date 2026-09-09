import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  Truck,
  Utensils,
  CakeSlice,
} from 'lucide-react'

const services = [
  {
    title: 'Food Delivery',
    description:
      'Freshly prepared West African favourites delivered to your door.',
    image: '/images/jollof-rice.png',
    href: '/explore',
    icon: Truck,
    action: 'Order now',
  },
  {
    title: 'Event Catering',
    description:
      'Beautifully prepared food for weddings, birthdays and corporate events.',
    image: '/images/fullhouse-box.png',
    href: '/book',
    icon: Utensils,
    action: 'Plan your event',
  },
  {
    title: 'Custom Cakes',
    description:
      'Beautiful cakes designed for birthdays, celebrations and special moments.',
    image: '/images/wedding-cake.png',
    href: '/explore',
    icon: CakeSlice,
    action: 'Get a quote',
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[0.8fr_1.8fr] gap-10 lg:gap-16 items-end mb-10">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#5D9F32] mb-3">
              What we offer
            </p>

            <h2 className="font-serif text-red-600 text-4xl lg:text-5xl leading-[1.05] font-semibold text-[#171922]">
              More than
              <br />
              just food.
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-[#171922]/65 leading-7 text-base lg:text-lg">
              From everyday meals to unforgettable celebrations,
              Jaisol brings authentic West African flavours,
              thoughtful service and beautiful food to every occasion.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <Link
                key={service.title}
                href={service.href}
                className="group"
              >
                <article className="rounded-[24px] overflow-hidden bg-white border border-black/[0.07] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-[#9ED061] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#171922]" />
                    </div>
                  </div>

                  <div className="p-6">

                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      {service.title}
                    </h3>

                    <p className="text-sm text-[#171922]/60 leading-6 mb-5">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#5D9F32]">
                      {service.action}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}