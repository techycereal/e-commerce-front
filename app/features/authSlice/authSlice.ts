'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Define a type for the slice state
interface AuthState {
  auth: string,
  access: number
}

// Define the initial state using that type
const initialState: AuthState = {
  auth: '',
  access: 0
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    authAction: (state, input) => {
      state.auth = input.payload
    },
    adminAction: (state, input) => {
      state.access = input.payload
    },
  },
})

export const { authAction, adminAction } = authSlice.actions


export default authSlice.reducer