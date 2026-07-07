import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartState {
  items: CartItem[]
  totalPrice: number
  deliveryAddress?: string
  phone?: string
  specialNotes?: string
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }>) => {
      const existingItem = state.items.find(
        (item) => item.menuItemId === action.payload.menuItemId
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity ?? 1
      } else {
        state.items.push({
          id: `${action.payload.menuItemId}-${Date.now()}`,
          quantity: action.payload.quantity ?? 1,
          ...action.payload,
        })
      }

      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    },

    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; quantity: number; notes?: string }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
        if (action.payload.notes) {
          item.notes = action.payload.notes
        }
      }
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    },

    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.deliveryAddress = undefined
      state.phone = undefined
      state.specialNotes = undefined
    },

    setDeliveryInfo: (
      state,
      action: PayloadAction<{
        deliveryAddress?: string
        phone?: string
        specialNotes?: string
      }>
    ) => {
      state.deliveryAddress = action.payload.deliveryAddress
      state.phone = action.payload.phone
      state.specialNotes = action.payload.specialNotes
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setDeliveryInfo,
} = cartSlice.actions

export default cartSlice.reducer
