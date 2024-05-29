'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { startAction } from '@/app/features/cart/cartSlice';
import { useEffect } from 'react';
import axios from 'axios';
export default function Header() {
    const accessToken = useSelector((state: RootState) => state.auth.auth);
    const adminAccess = useSelector((state: RootState) => state.auth.access);
    const cartAmount = useSelector((state: RootState) => state.cart.amount);
    const dispatch = useDispatch<AppDispatch>();
    
    const pathname = usePathname();
    useEffect(() => {
        const getCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/cartcount', { headers: { Authorization: `Bearer ${accessToken}` } })
                dispatch(startAction(response.data));   
            } catch(err) {
                dispatch(startAction(0));  
            }
        }
        getCartItems()
    }, [accessToken])

    return (
        <nav className="flex mb-4 fixed top-0 w-full bg-white shadow-md z-10 mb-10 " aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 p-4">
                <li className="inline-flex items-center">
                    <Link href="/" className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ${pathname == '/' && 'text-blue-500'}`}>
                        Home
                    </Link>
                </li>
                <li className="inline-flex items-center">
               
                <Link href="/mycart" className={`ml-2 text-sm font-medium text-gray-700 hover:text-blue-600 relative ${pathname == '/mycart' && 'text-blue-500'}`}>
                <>
                <p>My Cart</p>
                {cartAmount > 0 && (
                    <span className="absolute -top-3 -right-3 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {cartAmount}
                    </span>
                )}
                </>
            </Link>
                
                </li>
                <li className="inline-flex items-center">
                    <Link href="/authentication" className={`ml-2 text-sm font-medium text-gray-700 hover:text-blue-600 ${pathname == '/authentication' && 'text-blue-500'}`}>
                        {!accessToken.length ? 'Log In' : 'Sign Out'}
                    </Link>
                </li>
                <li className="inline-flex items-center">
                    <Link href="/admin/products" className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ${pathname == '/admin/products' || pathname == '/admin/orders' && 'text-blue-500'}`}>
                        {adminAccess == 1 && 'Admin' }
                    </Link>
                </li>
            </ol>
        </nav>
    );
}
