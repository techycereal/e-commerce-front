'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Define a type for the slice state
interface cartState {
  amount: number
}

// Define the initial state using that type
const initialState: cartState = {
  amount: 0,
}

export const cartSlice = createSlice({
  name: 'amount',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    cartAction: (state) => {
      state.amount += 1
    },
    removeAction: (state) => {
        state.amount -= 1
      },
    startAction: (state, input) => {
        state.amount = input.payload
      },
  },
})

export const { cartAction, startAction, removeAction } = cartSlice.actions


export default cartSlice.reducer