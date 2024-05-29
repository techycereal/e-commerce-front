'use client'

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { payAction, myProducts } from '../features/payment/paymentSlice';
import { removeAction } from '../features/cart/cartSlice';
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    desc: string;
    longDesc: string;
    pic?: string; // Assuming 'pic' is also part of product
}

export default function MyCart() {
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.auth.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [products, setProducts] = useState<Product[]>([]);
    const [productAmount, setProductAmount] = useState<number>(0);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axios.get('/api/cart/getcart', { headers: { Authorization: `Bearer ${accessToken}` } });
                setProducts(response.data);
                setProductAmount(() => {
                    try {
                        const totalAmount = response.data.reduce((acc: number, item: Product) => acc + parseInt(item.price as any, 10), 0);
                        return totalAmount;
                    } catch (err) {
                        setError("I'm sorry we're running into some difficulties");
                        return 0;
                    }
                });
            } catch (err) {
                setError("I'm sorry we're running into some difficulties");
            }
        }
        getAllProducts();
    }, [accessToken]);

    useEffect(() => {
        if(!accessToken){
            router.back()
        }
        if (products.length) {
            try {
                setProductAmount(() => {
                    try {
                        const totalAmount = products.reduce((acc, item) => acc + parseInt(item.price as any, 10), 0);
                        return totalAmount;
                    } catch (err) {
                        setError("I'm sorry we're running into some difficulties");
                        return 0;
                    }
                });
            } catch (err) {
                setError("I'm sorry we're running into some difficulties");
            }
        }
    }, [products]);

    const removeItem = async (item: Product) => {
        try {
            setProducts((prev) => {
                const newPrev = prev.filter(items => items._id !== item._id);
                return newPrev;
            });
            await axios.post('/api/cart/remove', item, { headers: { Authorization: `Bearer ${accessToken}` } });
            dispatch(removeAction());
        } catch (err) {
            setError("I'm sorry we're running into some difficulties");
        }
    }

    const Payment = () => {
        dispatch(payAction(productAmount));
        dispatch(myProducts(products));
        router.push('/payment');
    }

    return (
        <div className='container mx-auto p-4 mt-20'>
            {error ? (
                <>
                    {error}
                </>
            ) : (
                <>
                    {!products.length ? <p>Nothing Here</p> : (
                        <>
                            <p className='text-2xl font-semibold mb-4'>Your Total: ${productAmount}</p>
                            {products.map((item) => (
                                <div key={item._id} className='flex flex-col md:flex-row items-center bg-white shadow-lg rounded p-4 mb-4'>
                                    <img src={item.pic} className='w-full md:w-1/3 h-auto object-cover rounded mb-4 md:mb-0' />
                                    <div className='md:ml-6 flex flex-col justify-between'>
                                        <p className='text-xl md:text-2xl font-bold'>{item.name}</p>
                                        <p className='text-lg md:text-xl text-gray-700 mb-2'>${item.price}</p>
                                        <button className='bg-red-500 p-2 rounded text-white self-start' onClick={() => removeItem(item)}>Remove Item</button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    <button onClick={Payment} className='fixed bottom-4 right-4 rounded-lg bg-green-600 p-2 text-white'>Proceed To Checkout</button>
                </>
            )}
        </div>
    )
}
