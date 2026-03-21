"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Cpu, ShieldCheck, Package, ArrowLeft, Minus, Plus } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlowButton } from '@/components/ui/GlowButton';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const { user } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    const isWishlisted = wishlist.some(item => item.id === id);

    useEffect(() => {
        setProduct({
            id: id,
            productName: "NVIDIA GeForce RTX 4090 Founders Edition",
            price: 1599.99,
            gamerRating: 9.8,
            stock: 12,
            category: "GPU",
            brand: "NVIDIA",
            platform: "PC",
            description: "The ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics. Experience ultra-high performance gaming, incredibly detailed virtual worlds with ray tracing, unprecedented productivity, and new ways to create. It's powered by the NVIDIA Ada Lovelace architecture and comes with 24 GB of G6X memory to deliver the ultimate experience for gamers and creators.",
            performanceTags: ["4K Native", "DLSS 3.0", "Ray Tracing Core", "Ada Lovelace"],
            compatibility: "PCIe 4.0 x16, 850W PSU Minimum",
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=800&fit=crop",
            reviews: []
        });
    }, [id]);

    if (!product) return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-neon-blue rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">

            <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                {/* Left: Interactive Image Gallery */}
                <div className="space-y-4">
                    <GlassPanel className="p-4 sm:p-12 aspect-square flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-full object-contain relative z-10 custom-cursor-zoom"
                        />
                    </GlassPanel>
                </div>

                {/* Right: Product Info & Actions */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">
                            {product.brand}
                        </span>
                        <span className="bg-neon-blue/20 text-neon-blue text-xs font-bold px-3 py-1 rounded border border-neon-blue/30 uppercase flex items-center gap-1">
                            <Star className="w-3 h-3 fill-neon-blue" />
                            {product.gamerRating} Gamer Rating
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                        {product.productName}
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="flex items-end justify-between mb-8 pb-8 border-b border-white/10">
                        <div>
                            <span className="block text-slate-500 uppercase tracking-widest text-sm mb-1">Price</span>
                            <span className="text-5xl font-black text-white text-glow-blue">₹{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <Package className="w-5 h-5 text-neon-green" />
                            <span className="font-medium">{product.stock} In Stock</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <span className="text-slate-400 font-medium">Quantity:</span>
                        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:text-neon-blue transition-colors text-slate-400 disabled:opacity-50" disabled={quantity <= 1}><Minus className="w-5 h-5" /></button>
                            <span className="w-12 text-center font-bold text-white text-lg">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:text-neon-blue transition-colors text-slate-400"><Plus className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {user?.role === 'ADMIN' ? (
                        <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-xl p-6 text-center">
                            <div className="text-neon-blue font-black uppercase tracking-widest text-sm mb-2">Administrative View</div>
                            <p className="text-slate-400 text-xs">Ordering is disabled for Admin accounts. Manage this product in the dashboard.</p>
                            <Link href="/admin/products" className="inline-block mt-4 text-neon-blue hover:underline text-sm font-bold">Open Inventory Control →</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <GlowButton variant="blue" className="py-4 text-lg w-full" onClick={() => addToCart(product, quantity)}>
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </GlowButton>
                            <GlowButton
                                variant={isWishlisted ? "red" : "purple"}
                                glowOnHoverOnly
                                onClick={() => toggleWishlist(product)}
                                className="py-4 text-lg w-full bg-slate-900 border-slate-700 hover:border-current"
                            >
                                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-neon-red' : ''}`} />
                                {isWishlisted ? 'Saved' : 'Wishlist'}
                            </GlowButton>
                        </div>
                    )}

                    {/* Specs Panel */}
                    <GlassPanel className="p-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-neon-purple" /> Tech Specs
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase tracking-widest mb-1">Performance Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.performanceTags?.map((tag: string) => (
                                        <span key={tag} className="text-xs font-medium bg-slate-800 text-slate-200 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {product.compatibility && (
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase tracking-widest mb-1 leading-tight flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Compatibility
                                    </span>
                                    <span className="text-sm text-slate-300">{product.compatibility}</span>
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                </div>
            </div>
        </div>
    );
}
