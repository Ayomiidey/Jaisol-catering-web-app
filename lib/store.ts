import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cart-slice'
import filterReducer from './slices/filter-slice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filters: filterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
