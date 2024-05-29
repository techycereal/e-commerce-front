'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const stripePromise = loadStripe(`${process.env.STRIPE_KEY}`);

interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [myItems, setMyItems] = useState<string[]>([]);
  const amount = useSelector((state: RootState) => state.amount.amount);
  const items = useSelector((state: RootState) => state.amount.items);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post('/api/payment/intent', { amount: amount * 100 });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setError('Failed to create payment intent');
      }
    };
    setMyItems(() => items.map((item: { productId: string }) => item.productId));
    createPaymentIntent();
  }, [amount, items]);

  const handleChange = (event: any) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleShippingChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShippingDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    const schema = Joi.object({
      amount: Joi.number().required(),
      shipping: Joi.object({
        name: Joi.string().min(1).required(),
        address: Joi.string().min(1).required(),
        city: Joi.string().min(1).required(),
        state: Joi.string().min(1).required(),
        postalCode: Joi.string().min(1).required(),
        country: Joi.string().min(1).required()
      }).required(),
      orders: Joi.array().items(Joi.string().min(1)).required(),
    });

    const body = {
      amount: amount,
      shipping: {
        name: shippingDetails.name,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country
      },
      orders: myItems
    };

    const { error: validationError } = schema.validate(body);

    if (validationError) {
      setError('Please fill out all forms correctly.');
      setProcessing(false);
      return;
    } else {
      const payload = await stripe?.confirmCardPayment(clientSecret!, {
        payment_method: {
          card: elements!.getElement(CardElement)!,
          billing_details: {
            name: shippingDetails.name,
            address: {
              line1: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state,
              postal_code: shippingDetails.postalCode,
              country: shippingDetails.country
            }
          }
        },
        shipping: {
          name: shippingDetails.name,
          address: {
            line1: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            postal_code: shippingDetails.postalCode,
            country: shippingDetails.country
          }
        }
      });
  
      if (payload?.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        try {
          const response = await axios.post('/api/payment/complete', body);
          if (response.data) {
            setResultMessage('Payment succeeded!');
            setSucceeded(true);
            setError(null);
            setProcessing(false);
          } else {
            setError('Payment failed: Please check your details and try again.');
          }
        } catch (error) {
          setError('Failed to complete payment');
        } finally {
          setProcessing(false);
        }
      }
    }
  };

  const cardElementOptions: any = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#e3342f',
        iconColor: '#e3342f',
      },
    },
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={shippingDetails.name}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={shippingDetails.address}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={shippingDetails.city}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">State</label>
        <input
          type="text"
          name="state"
          value={shippingDetails.state}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={shippingDetails.postalCode}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Country</label>
        <input
          type="text"
          name="country"
          value={shippingDetails.country}
          onChange={handleShippingChange}
          className="p-3 border border-gray-300 rounded mb-4 w-full"
          required
        />
      </div>
      <CardElement id="card-element" options={cardElementOptions} onChange={handleChange} className="p-3 border border-gray-300 rounded mb-4" />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        className={`w-full bg-blue-500 text-white p-3 rounded ${processing || disabled || succeeded ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {processing ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
      {error && (
        <div className="text-red-500 text-center mt-4" role="alert">
          {error}
        </div>
      )}
      {resultMessage && (
        <p className={`${resultMessage === 'Payment succeeded!' ? 'text-green-500' : 'text-red-500'} text-center mt-4`}>
          {resultMessage}
        </p>
      )}
    </form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
