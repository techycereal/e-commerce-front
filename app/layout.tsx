'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from './store';
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <div className="pb-20">
          <Header/>
          </div>
          {children}
        </Provider>
      </body>
    </html>
  );
}
