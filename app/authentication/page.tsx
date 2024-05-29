'use client'

import axios from 'axios';
import { useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { authAction, adminAction } from '../features/authSlice/authSlice';

export default function Home() {
  interface Authentication {
    email: string;
    password: string;
  }

  const accessToken = useSelector((state: RootState) => state.auth.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function authFunction() {
    try {
      const body: Authentication = {
        email: email,
        password: password,
      }
      const response = await axios.post('/api/auth', body);
      dispatch(adminAction(response.data.data.userrole));
      dispatch(authAction(response.data.data.token));
    } catch (err) {
      setError('Try again in a few moments');
    }
  }

  async function LogOut() {
    dispatch(authAction(''));
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-md w-80">
    {!accessToken.length ? (
      <>
        <input
          value={email}
          onChange={handleEmailChange}
          placeholder="Email..."
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password..."
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
        />
        <div className="text-red-500 mb-4">
          {error}
        </div>
        <button
          className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
          onClick={authFunction}
        >
          Log In
        </button>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">Admin sign in: admin, password: admin</p>
          <p className="mb-2">Average User: user, user</p>
          <p>Because this is custom authentication and runs on a serverless SQL database, you might need to try to sign in a few times to let the database start up.</p>
        </div>
      </>
    ) : (
      <button
        className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
        onClick={LogOut}
      >
        Sign Out
      </button>
    )}
  </div>
</div>

  );
}
