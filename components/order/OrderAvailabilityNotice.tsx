'use client'

import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { formatOrderDate, getUKDateString, isOrderServiceDate } from '@/lib/order-schedule'

export function OrderAvailabilityNotice() {
  const [today, setToday] = useState(() => getUKDateString())

  useEffect(() => {
    const interval = window.setInterval(() => setToday(getUKDateString()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const availableToday = isOrderServiceDate(today)

  return (
    <aside className={`flex items-start gap-3 rounded-2xl border p-4 ${availableToday ? 'border-primary/20 bg-primary/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
      <CalendarClock className={`mt-0.5 h-5 w-5 shrink-0 ${availableToday ? 'text-primary' : 'text-amber-700 dark:text-amber-400'}`} />
      <div>
        <p className="font-semibold">
          {availableToday ? 'Chef-prepared orders are available today' : 'Chef-prepared orders are available Thursday to Saturday'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {availableToday
            ? `Today is ${formatOrderDate(today, { weekday: 'long', day: 'numeric', month: 'long' })}. Checkout will schedule your order for today.`
            : 'We are not preparing orders today. At checkout, choose one of the next available dates and we will schedule your order for that day.'}
        </p>
      </div>
    </aside>
  )
}
