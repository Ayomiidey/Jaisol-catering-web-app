export interface Order {
  id: string
  items: string[]
  date: string
  amount: number
  status: string
}

export interface CateringBookingSummary {
  id: string
  event: string
  date: string
  eventTime?: string | null
  location: string
  status: string
}