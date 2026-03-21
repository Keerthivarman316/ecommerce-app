"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { GlowButton } from '@/components/ui/GlowButton';

export default function WishlistPage() {
    const { wishlist } = useStore();

    return (
        <div className="max-w-7xl mx-auto pb-20 mt-8 px-4">
            <div className="flex items-center gap-3 mb-10">
                <Heart className="w-8 h-8 text-neon-red" />
                <h1 className="text-4xl font-black text-white uppercase tracking-tight">Your Wishlist</h1>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 border border-dashed border-slate-700/50 rounded-2xl bg-slate-900/10">
                    <Heart className="w-16 h-16 text-slate-700 mb-4" />
                    <h2 className="text-xl font-bold text-slate-400 mb-2">NO FAVORITES YET</h2>
                    <Link href="/products">
                        <GlowButton variant="red" className="mt-4">Explore Arsenal</GlowButton>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((item, index) => (
                        <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
                            <ProductCard product={item} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
