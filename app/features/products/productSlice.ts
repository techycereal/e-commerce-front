'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Define a type for the slice state
interface ProductState {
  products: any
}

// Define the initial state using that type
const initialState: ProductState = {
  products: []
}

export const ProductSlice = createSlice({
  name: 'products',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    productAction: (state, input) => {
      state.products = input.payload.products
    },
  },
})

export const { productAction } = ProductSlice.actions

export default ProductSlice.reducer