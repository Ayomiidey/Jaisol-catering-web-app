// import { Star } from 'lucide-react'

// const reviews = [
//   {
//     name: 'Tolu A.',
//     text: 'Absolutely loved the catering! The food was authentic and delicious.',
//   },
//   {
//     name: 'Sarah K.',
//     text: "Best jollof rice I've had outside of West Africa!",
//   },
//   {
//     name: 'Kehinde M.',
//     text: 'Professional, reliable and the food was amazing.',
//   },
// ]

// export function ReviewsSection() {
//   return (
//     <section className="bg-[#171922] text-white py-20 lg:py-24 px-5 lg:px-8">

//       <div className="max-w-7xl mx-auto">

//         <div className="mb-10">

//           <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#9ED061] mb-3">
//             Customer love
//           </p>

//           <h2 className="font-serif text-4xl lg:text-5xl">
//             What our customers say.
//           </h2>

//         </div>

//         <div className="grid md:grid-cols-3 gap-5">

//           {reviews.map((review) => (
//             <article
//               key={review.name}
//               className="p-7 rounded-[24px] bg-white/[0.06] border border-white/10"
//             >

//               <div className="flex gap-1 mb-6">
//                 {[...Array(5)].map((_, index) => (
//                   <Star
//                     key={index}
//                     className="w-4 h-4 fill-[#DA231D] text-[#DA231D]"
//                   />
//                 ))}
//               </div>

//               <p className="font-serif text-xl leading-8 text-white/90 mb-7">
//                 "{review.text}"
//               </p>

//               <div className="flex items-center gap-3">

//                 <div className="w-9 h-9 rounded-full bg-[#9ED061] text-[#171922] flex items-center justify-center font-bold text-sm">
//                   {review.name[0]}
//                 </div>

//                 <span className="text-sm font-semibold">
//                   {review.name}
//                 </span>

//               </div>

//             </article>
//           ))}

//         </div>
//       </div>
//     </section>
//   )
// }


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