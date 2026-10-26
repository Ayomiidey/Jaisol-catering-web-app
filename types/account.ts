export interface Order {
  id: string
  items: Array<{
    menuItemId: string
    quantity: number
    priceAtPurchase: number
    notes: string | null
    menuItem: {
      id: string
      name: string
      price: number
      imageUrl: string | null
      isAvailable: boolean
    }
  }>
  date: string
  amount: number
  status: string
  deliveryAddress: string | null
  phone: string | null
  notes: string | null
  allergies: string | null
}

export interface CateringBookingSummary {
  id: string
  event: string
  date: string
  eventTime?: string | null
  location: string
  status: string
}
