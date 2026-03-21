import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Zap, Clock } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { GlowButton } from './GlowButton';
import { useStore } from '@/context/StoreContext';

interface Product {
    id: string;
    productName: string;
    price: number;
    image?: string;
    category: string;
    brand: string;
    platform?: string;
    stock: number;
    gamerRating: number;
    stockUrgency?: string;
    performanceTags?: string[];
}

export function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useStore();

    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    return (
        <GlassPanel interactive className="flex flex-col h-full relative overflow-hidden group">

            {/* Labels */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.platform && (
                    <span className="bg-slate-900/80 backdrop-blur-md text-xs font-bold text-neon-blue px-2 py-1 rounded border border-neon-blue/30 uppercase">
                        {product.platform}
                    </span>
                )}
                {product.performanceTags?.[0] && (
                    <span className="bg-neon-purple/20 backdrop-blur-md text-xs font-bold text-purple-200 px-2 py-1 rounded border border-neon-purple/30 uppercase flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {product.performanceTags[0]}
                    </span>
                )}
            </div>

            <div className="absolute top-3 right-3 z-10">
                {isOutOfStock ? (
                    <span className="bg-neon-red/20 text-red-400 text-xs font-bold px-2 py-1 rounded border border-neon-red/30">OUT OF STOCK</span>
                ) : isLowStock ? (
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded border border-orange-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {product.stockUrgency || 'ALMOST GONE'}
                    </span>
                ) : null}
            </div>

            {/* Image Area */}
            <Link href={`/products/${product.id}`} className="block relative w-full pt-[100%] bg-black/40 overflow-hidden">
                {/* Placeholder image for now */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black group-hover:scale-110 transition-transform duration-500">
                    {product.image ? (
                        <img src={product.image} alt={product.productName} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">LOOT</span>
                    )}
                </div>
            </Link>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{product.brand}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {product.gamerRating.toFixed(1)}
                    </div>
                </div>

                <Link href={`/products/${product.id}`} className="mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors line-clamp-2 leading-tight">
                        {product.productName}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Price</span>
                        <span className="text-2xl font-black text-white text-glow-blue">₹{product.price.toFixed(2)}</span>
                    </div>

                    <GlowButton
                        variant="blue"
                        className="px-3 py-2"
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product)}
                        glowOnHoverOnly
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </GlowButton>
                </div>
            </div>
        </GlassPanel>
    );
}
