import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Plus, Star } from 'lucide-react'

interface KitchenSectionProps {
  items: any[]
}

export function KitchenSection({ items }: KitchenSectionProps) {
  return (
    <section className="bg-[#171922] text-white py-20 lg:py-28 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-12">

        {/* Left text block */}
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#9ED061] mb-3">
            Our signature dishes
          </p>

          <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-4">
            Authentic. Rich.
            <br />
            Unforgettable.
          </h2>

          <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
            Our signature dishes are made with traditional recipes, using the
            finest ingredients to deliver the true taste of West Africa.
          </p>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 w-fit px-5 py-3 rounded-full bg-white text-[#171922] text-sm font-semibold hover:bg-[#9ED061] transition"
          >
            View full menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {items.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="group">
              <article className="bg-white text-[#171922] rounded-[22px] overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm font-bold text-[#DA231D] mt-0.5">
                        £{item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-[#f0b429] text-[#f0b429]"
                          />
                        ))}
                        {item.rating && (
                          <span className="text-xs text-black/40 ml-1">
                            ({item.rating})
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => e.preventDefault()}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-[#9ED061] flex items-center justify-center hover:bg-[#DA231D] hover:text-white transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}



// import Link from 'next/link'
// import Image from 'next/image'
// import { ArrowRight, Plus } from 'lucide-react'

// interface KitchenSectionProps {
//   items: any[]
// }

// export function KitchenSection({ items }: KitchenSectionProps) {
//   return (
//     <section className="bg-[#9ED061] text-white py-20 lg:py-28 px-5 lg:px-8">
//       <div className="max-w-7xl mx-auto">

//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">

//           <div>
//             <p className="text-xs uppercase tracking-[0.2em] font-bold text-red-700 mb-3">
//               Our signature dishes
//             </p>

//             <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
//               Authentic. Rich.
//               <br />
//               Unforgettable.
//             </h2>
//           </div>

//           <Link
//             href="/explore"
//             className="inline-flex items-center gap-2 w-fit px-5 py-3 rounded-full bg-white text-[#171922] text-sm font-semibold hover:bg-[#9ED061] transition"
//           >
//             View full menu
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-5">

//           {items.map((item) => (
//             <Link
//               key={item.id}
//               href={`/product/${item.id}`}
//               className="group"
//             >
//               <article className="bg-white text-[#171922] rounded-[22px] overflow-hidden">

//                 <div className="relative aspect-[4/3] overflow-hidden bg-[#eee]">

//                   {item.imageUrl && (
//                     <Image
//                       src={item.imageUrl}
//                       alt={item.name}
//                       fill
//                       className="object-cover transition-transform duration-700 group-hover:scale-105"
//                     />
//                   )}

//                   <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white text-sm font-bold shadow">
//                     £{item.price.toFixed(2)}
//                   </div>
//                 </div>

//                 <div className="p-5">

//                   <div className="flex items-center justify-between gap-3">

//                     <div>
//                       <h3 className="text-xl font-semibold">
//                         {item.name}
//                       </h3>

//                       <p className="text-sm text-black/50 mt-1">
//                         {item.category}
//                       </p>
//                     </div>

//                     <button
//                       onClick={(e) => e.preventDefault()}
//                       className="w-9 h-9 rounded-full bg-[#9ED061] flex items-center justify-center hover:bg-[#DA231D] hover:text-white transition"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>

//                   </div>

//                 </div>
//               </article>
//             </Link>
//           ))}

//         </div>
//       </div>
//     </section>
//   )
// }












// // import Link from 'next/link'
// // import { ArrowRight } from 'lucide-react'
// // import { FoodCard } from '@/components/shared/FoodCard'

// // interface KitchenSectionProps {
// //   items: any[]
// // }

// // export function KitchenSection({ items }: KitchenSectionProps) {
// //   return (
// //     <section className="px-4 py-6">
// //       <div className="mb-4 flex items-center justify-between">
// //         <h3 className="text-lg font-bold">From the kitchen</h3>
// //         <Link href="/explore" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
// //           See all <ArrowRight className="w-3.5 h-3.5" />
// //         </Link>
// //       </div>
// //       <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible">
// //         {items.map((item) => (
// //           <FoodCard key={item.id} item={item} variant="grid" />
// //         ))}
// //       </div>
// //     </section>
// //   )
// // }