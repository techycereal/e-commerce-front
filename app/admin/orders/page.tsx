'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from 'next/link';
import AdminHeader from '@/app/components/AdminHeader';
import { useRouter } from 'next/navigation';
interface Order {
    orderId: string;
    email: string;
    orders: string;
    shipping: string;
    orderDate: string;
}

const Store: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.auth.auth);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string>('');
    const router = useRouter()
    useEffect(() => {
        if(!accessToken){
            router.back()
        }
        const getAllOrders = async () => {
            try {
                const response = await axios.get('/api/payment/orders', { headers: { Authorization: `Bearer ${accessToken}` } });
                setOrders(response.data);
            } catch (error) {
                setError("I'm sorry we're running into some difficulties");
            }
        };
        getAllOrders();
    }, [accessToken]);

    const completeOrder = async (orderId: string) => {
        try {
            await axios.post('/api/payment/completed', { id: orderId }, { headers: { Authorization: `Bearer ${accessToken}` } });
            setOrders(prev => prev.filter(order => order.orderId !== orderId));
        } catch (error) {
            setError("I'm sorry we're running into some difficulties");
        }
    };

    return (
        <div className="container mx-auto px-4 mt-10">
            <AdminHeader />
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-6">Orders</h1>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        orders.map((order, index) => {
                            const productIds = order.orders.split(','); // Convert string to array
                            return (
                                <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
                                    <p className="text-lg font-semibold">Order Name: {order.email}</p>
                                    <div className="text-gray-700">
                                        <span className="font-semibold">Product IDs:</span>
                                        <div className="flex flex-wrap mt-2">
                                            {productIds.map((productId, idx) => (
                                                <Link href={`/${productId}`} key={idx} className="bg-gray-200 text-gray-700 p-1 m-1 rounded">
                                                    {productId}
                                                </Link>
                                            ))}
                                        </div>
                                        <span className="font-semibold">Shipping Information:</span>
                                        <div className="flex flex-wrap mt-2">
                                            {order.shipping}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-2">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <button className="bg-green-500 text-white font-bold p-2 rounded" onClick={() => completeOrder(order.orderId)}>
                                        Complete Order
                                    </button>
                                </div>
                            );
                        })
                    )}
                </>
            )}
        </div>
    );
}

export default Store;
