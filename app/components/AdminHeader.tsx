'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function AdminHeader() {
    const pathname = usePathname();
    return (
        <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 p-4">
                <li className="inline-flex items-center">
                    <Link href="/admin/products" className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ${pathname == '/admin/products' && 'text-blue-500'}`}>
                        Products
                    </Link>
                </li>
                <li className="inline-flex items-center">
                    <Link href="/admin/orders" className={`ml-2 text-sm font-medium text-gray-700 hover:text-blue-600 relative ${pathname == '/admin/orders' && 'text-blue-500'}`}>
                        Orders
                    </Link>
                </li>
                <li className="inline-flex items-center">
                    <Link href="/admin/completedorders" className={`ml-2 text-sm font-medium text-gray-700 hover:text-blue-600 relative ${pathname == '/admin/completedorders' && 'text-blue-500'}`}>
                        Completed Orders
                    </Link>
                </li>
            </ol>
        </nav>
    );
}
