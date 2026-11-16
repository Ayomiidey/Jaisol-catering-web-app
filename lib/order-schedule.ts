export const ORDER_SERVICE_DAYS = [4, 5, 6] as const // Thursday, Friday, Saturday

export function getUKDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''

  return `${part('year')}-${part('month')}-${part('day')}`
}

export function isOrderServiceDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false
  const weekday = parsed.getUTCDay()
  return ORDER_SERVICE_DAYS.includes(weekday as (typeof ORDER_SERVICE_DAYS)[number])
}

export function getUpcomingOrderDates(startDate: string, count = 9): string[] {
  const [year, month, day] = startDate.split('-').map(Number)
  const cursor = new Date(Date.UTC(year, month - 1, day))
  const dates: string[] = []

  for (let offset = 0; dates.length < count && offset < 90; offset += 1) {
    const date = new Date(cursor)
    date.setUTCDate(cursor.getUTCDate() + offset)
    const dateString = date.toISOString().slice(0, 10)
    if (isOrderServiceDate(dateString)) dates.push(dateString)
  }

  return dates
}

export function formatOrderDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  const dateOnly = date.slice(0, 10)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  }).format(new Date(`${dateOnly}T12:00:00.000Z`))
}
