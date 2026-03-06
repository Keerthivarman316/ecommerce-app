"use client";

import Link from 'next/link';
import { ShoppingCart, LogOut, User as UserIcon, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const isLoggedIn = false;
  const cartItemCount = 3;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#131921] border-b border-gray-800 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LEFT: Logo */}
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-[#f3a847] transition-colors md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-black text-white tracking-tighter"
              >
                ANTI<span className="text-[#3b82f6]">STORE</span>
              </motion.span>
            </Link>
          </div>

          {/* MIDDLE: Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full relative group">
              <input 
                type="text" 
                placeholder="Search premium products..." 
                className="w-full bg-[#232f3e] text-white border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-[#f3a847] hover:bg-[#f4b563] text-gray-900 rounded-r-lg transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 font-bold" />
              </button>
            </div>
          </div>

          {/* RIGHT: Navigation Links & Cart */}
          <div className="flex items-center gap-6 text-white text-sm font-semibold">
            
            {/* Auth Buttons */}
            {isLoggedIn ? (
               <div className="hidden md:flex flex-col cursor-pointer hover:text-[#f3a847] transition">
                <span className="text-xs text-gray-400 font-normal">Hello, Admin</span>
                <span>Account & Lists</span>
               </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hidden md:flex flex-col hover:text-[#f3a847] transition">
                  <span className="text-xs text-gray-400 font-normal">Hello, sign in</span>
                  <span>Account & Lists</span>
                </Link>
              </div>
            )}

            {/* Shopping Cart Button */}
            <Link href="/cart">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-end gap-1 hover:text-[#f3a847] transition-colors cursor-pointer"
              >
                <div className="relative">
                  <ShoppingCart className="w-8 h-8" />
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 left-3 bg-[#f3a847] text-gray-900 text-xs font-black rounded-full h-5 w-6 flex items-center justify-center border-2 border-[#131921]"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </div>
                <span className="hidden md:block font-bold mt-2">Cart</span>
              </motion.div>
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}