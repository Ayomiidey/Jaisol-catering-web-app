import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  selectedCategory: string | null
  searchTerm: string
}

const initialState: FilterState = {
  selectedCategory: null,
  searchTerm: '',
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    clearFilters: (state) => {
      state.selectedCategory = null
      state.searchTerm = ''
    },
  },
})

export const { setCategory, setSearchTerm, clearFilters } = filterSlice.actions

export default filterSlice.reducer
