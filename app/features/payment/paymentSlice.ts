'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Define a type for the slice state
interface PayState {
  amount: number,
  items: any
}

// Define the initial state using that type
const initialState: PayState = {
  amount: 0,
  items: [],
}

export const paySlice = createSlice({
  name: 'amount',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    payAction: (state, input) => {
      state.amount = input.payload
    },
    myProducts: (state, input) => {
        state.items = input.payload
      },
  },
})

export const { payAction, myProducts } = paySlice.actions


export default paySlice.reducer