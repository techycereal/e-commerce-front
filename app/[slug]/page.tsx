'use client'

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useEffect, useState } from 'react';
import { cartAction } from '@/app/features/cart/cartSlice';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  longDesc: string;
  pic: string;
}

interface SlugProps {
  params: {
    slug: string;
  };
}

const Slug: React.FC<SlugProps> = ({ params: { slug } }) => {
  const accessToken = useSelector((state: RootState) => state.auth.auth);
  const [product, setProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getProduct = async (id: string) => {
      const url = `/api/productAPI/${id}`;
      const response = await axios.get(url);
      setProduct(response.data.data);
    };
    getProduct(slug);
  }, [slug]);

  const addToCart = async () => {
    if (product) {
      await axios.post('/api/cart/add', product, { headers: { Authorization: `Bearer ${accessToken}` } });
      dispatch(cartAction());
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      {product ? (
        <div className='flex flex-col lg:flex-row items-center lg:items-start'>
          <div className='lg:w-1/2'>
            <img src={product.pic} className='w-full h-auto shadow-lg rounded' alt={product.name} />
          </div>
          <div className='lg:w-1/2 lg:ml-8 mt-8 lg:mt-0 flex flex-col justify-between'>
            <div>
              <h1 className='text-4xl font-bold mb-2'>{product.name}</h1>
              <p className='text-xl text-gray-800 mb-4'>${product.price}</p>
              <p className='text-gray-600 mb-4'>{product.longDesc}</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500">
                  ★★★★☆
                </span>
                <span className="ml-2 text-gray-600">(10 reviews)</span>
              </div>
              <div className="mb-4">
                <span className="text-green-500">In Stock</span>
              </div>
            </div>
            <div>
              <button className="bg-yellow-500 p-3 rounded text-white w-full lg:w-auto lg:mt-auto" onClick={addToCart}>
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Slug;
