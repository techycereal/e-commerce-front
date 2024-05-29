'use client'
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlice/authSlice';
import paymentSlice from './features/payment/paymentSlice';
import cartSlice from './features/cart/cartSlice';
import productSlice from './features/products/productSlice';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    amount: paymentSlice,
    cart: cartSlice,
    product: productSlice
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 