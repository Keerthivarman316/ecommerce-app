'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, User, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { cart, wishlist } = useStore();

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sparkles className="h-8 w-8 text-neon-blue" />
                        </motion.div>
                        <Link href="/" className="text-2xl font-black tracking-tighter">
                            LOOT<span className="text-neon-blue text-glow-blue">BAY</span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-full leading-5 bg-slate-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue focus:bg-slate-900 transition-all duration-300 sm:text-sm"
                                placeholder="Search games, gear, components..."
                            />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium tracking-wide">
                            Store
                        </Link>
                        <Link href="/pc-builder" className="text-gray-300 hover:text-neon-purple transition-colors duration-200 font-medium tracking-wide flex items-center gap-1 group">
                            <span className="group-hover:text-glow-purple">PC Builder</span>
                        </Link>

                        <div className="flex items-center space-x-6 border-l border-slate-700 pl-6">
                            <Link href="/wishlist" className="relative text-gray-400 hover:text-neon-red transition-colors duration-200">
                                <Heart className="h-6 w-6" />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-neon-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className="relative text-gray-400 hover:text-neon-blue transition-colors duration-200">
                                <ShoppingCart className="h-6 w-6" />
                                {totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-neon-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalCartItems}
                                    </span>
                                )}
                            </Link>

                            <Link href="/profile" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <User className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-400 hover:text-white focus:outline-none">
                            <Menu className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
