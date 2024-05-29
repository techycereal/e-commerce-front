'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { productAction } from '@/app/features/products/productSlice';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import AdminHeader from '@/app/components/AdminHeader';
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  longDesc: string;
  pic: string;
  uniqueId?: string;
}

interface PageState {
  [key: string]: number;
}

const Store: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.auth);
  const cachedProducts = useSelector((state: RootState) => state.product.products);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>(cachedProducts);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<PageState>({});
  const [error, setError] = useState<string>('');
  const hasFetchedProducts = useRef(false);
  const fetchedProductIds = useRef(new Set<string>());
  const getAllProducts = async (start: number, end: number) => {
    try {
      const response = await axios.post('/api/productAPI/all', { start, end }, { headers: { Authorization: `Bearer ${accessToken}` } });
      const fetchedProducts: Product[] = response.data.data.data;

      if (fetchedProducts.length !== 0) {
        // Add unique ID to each product and filter out duplicates
        const productsWithUniqueIds = fetchedProducts
          .filter(product => !fetchedProductIds.current.has(product._id))
          .map(product => {
            fetchedProductIds.current.add(product._id);
            return { ...product, uniqueId: `${product._id}-${uuidv4()}` };
          });

        setProducts(prev => {
          const newProducts = [...prev, ...productsWithUniqueIds];
          dispatch(productAction({ products: newProducts }));
          return newProducts;
        });

        setCategories(prevCategories => {
          const uniqueCategories = productsWithUniqueIds.reduce<string[]>((acc, item) => {
            if (!acc.includes(item.category)) {
              acc.push(item.category);
            }
            return acc;
          }, prevCategories);
          return uniqueCategories;
        });

        setCurrentPage(prevPages => {
          const pages = { ...prevPages };
          productsWithUniqueIds.forEach(product => {
            if (!pages[product.category]) {
              pages[product.category] = Math.max(1, pages[product.category] || 1);
            }
          });
          return pages;
        });
      }
    } catch (error) {
      setError("I'm sorry we're running into some difficulties");
    }
  };

  useEffect(() => {
    if (!accessToken.length) {
      router.back();
    } else {
      try {
        if (!hasFetchedProducts.current) {
          hasFetchedProducts.current = true;
          if (cachedProducts.length === 0) {
            getAllProducts(0, 3);
          } else {
            setProducts(cachedProducts);
            const uniqueCategories = cachedProducts.reduce((acc: string[], item: Product) => {
              if (!acc.includes(item.category)) {
                acc.push(item.category);
              }
              return acc;
            }, []);
            setCategories(uniqueCategories);

            // Initialize currentPage for cached categories
            const pages: PageState = {};
            uniqueCategories.forEach((category: string) => {
              pages[category] = 1;
            });
            setCurrentPage(pages);
          }
        }
      } catch (err) {
        setError("I'm sorry we're running into some difficulties");
      }
    }
  }, [accessToken, cachedProducts, router]);

  const handleNextPage = async (category: string) => {
    const startIndex = currentPage[category] * 3;
    const endIndex = startIndex + 3;

    const cachedCategoryProducts = products.filter(product => product.category === category);
    if (endIndex <= cachedCategoryProducts.length) {
      setCurrentPage(prev => ({
        ...prev,
        [category]: (prev[category] || 1) + 1,
      }));
    } else {
      await getAllProducts(startIndex, endIndex);
      setCurrentPage(prev => ({
        ...prev,
        [category]: (prev[category] || 1) + 1,
      }));
    }
  };

  const editProduct = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const deleteProduct = async (id: string, pic: string) => {
    try {
      await axios.post('/api/productAPI/delete', { id, pic }, { headers: { Authorization: `Bearer ${accessToken}` } });
      const updatedProducts = products.filter(product => product._id !== id);
      setProducts(updatedProducts);
      dispatch(productAction({ products: updatedProducts }));
    } catch (error) {
      setError("I'm sorry we're running into some difficulties");
    }
  };

  const handlePrevPage = (category: string) => {
    setCurrentPage(prev => ({
      ...prev,
      [category]: Math.max((prev[category] || 2) - 1, 1),
    }));
  };

  // Group products by category
  const groupedProducts = categories.map(category => ({
    category,
    products: products.filter(product => product.category === category),
  }));

  return (
    <div className="container mx-auto mt-10 px-4">
      <AdminHeader />
      {error ? 
      <>
      {error}
      </>
      : 
      <>
        <Link className='bg-blue-400 text-white font-bold p-2 rounded fixed top-0 right-0 z-10' href={'/addproduct'}>Add Product</Link>
        {groupedProducts.map(group => {
          const startIndex = (currentPage[group.category] - 1) * 3;
          const paginatedProducts = group.products.slice(startIndex, startIndex + 3);

          return (
            <div key={group.category}>
              <h2 className="text-2xl font-semibold mb-4">{group.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map(item => (
                  <div key={item._id}>
                    <hr />
                    <div className='flex inline'>
                      <Link href={`/${item._id}`}><img src={item.pic} alt={item.name} className="max-w-20" /></Link>
                      <div className='ml-4'>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-700">${item.price}</p>
                      </div>
                    </div>
                    <button className='p-2 rounded bg-red-500 text-white font-bold' onClick={() => deleteProduct(item._id, item.pic)}>Delete</button>
                    <button className='p-2 rounded bg-blue-400 text-white font-bold ml-4' onClick={() => editProduct(item._id)}>Edit</button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => handlePrevPage(group.category)} disabled={currentPage[group.category] === 1}>
                  Previous
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => handleNextPage(group.category)} disabled={paginatedProducts.length < 3}>
                  Next
                </button>
              </div>
            </div>
          );
        })}
      </>}
    </div>
  );
}

export default Store;
