import { Star } from 'lucide-react'

interface ReviewCardProps {
  name: string
  text: string
}

export function ReviewCard({ name, text }: ReviewCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-secondary border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {name[0]}
          </div>
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">"{text}"</p>
    </div>
  )
}