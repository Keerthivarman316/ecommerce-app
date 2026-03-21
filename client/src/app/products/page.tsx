"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Settings2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlowButton } from '@/components/ui/GlowButton';
import axios from 'axios';

const MOCK_CATEGORIES = ["All", "GPU", "CPU", "Motherboard", "RAM", "Storage", "Case", "PSU", "Monitor", "Mouse", "Keyboard", "Audio", "Furniture"];
const MOCK_PLATFORMS = ["All", "PC", "PS5", "Xbox", "Nintendo"];
const MOCK_BRANDS = ["All", "NVIDIA", "AMD", "Intel", "ASUS", "Corsair", "Razer", "Sony"];

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [category, setCategory] = useState("All");
    const [platform, setPlatform] = useState("All");
    const [brand, setBrand] = useState("All");
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Construct query params
                const params = new URLSearchParams();
                if (category !== "All") params.append("category", category);
                if (platform !== "All") params.append("platform", platform);
                if (brand !== "All") params.append("brand", brand);
                if (minRating > 0) params.append("gamerRating", minRating.toString());
                params.append("limit", "100");

                const res = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
                if (res.data && res.data.products) {
                    setProducts(res.data.products);
                }
            } catch (err) {
                console.warn("Backend not reachable, showing empty state or mock state. Fallback handles this.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, platform, brand, minRating]);

    return (
        <div className="flex flex-col md:flex-row gap-8 pb-20 relative">

            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-end px-4">
                <GlowButton variant="purple" className="flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4" /> Filters
                </GlowButton>
            </div>

            {/* Sidebar - Sticky Filter Panel */}
            <aside className="hidden md:block w-72 shrink-0">
                <div className="sticky top-28">
                    <GlassPanel className="p-6">
                        <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-6">
                            <SlidersHorizontal className="w-5 h-5 text-neon-blue" />
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white">Filters</h2>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Category</h3>
                            <div className="space-y-2">
                                {MOCK_CATEGORIES.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={category === cat}
                                            onChange={() => setCategory(cat)}
                                            className="w-4 h-4 bg-slate-900 border-slate-700 checked:bg-neon-blue checked:focus:ring-neon-blue focus:ring-neon-blue focus:ring-offset-slate-900 transition-colors"
                                        />
                                        <span className={`text-sm tracking-wide transition-colors ${category === cat ? 'text-neon-blue font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Platform Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Platform</h3>
                            <div className="space-y-2">
                                {MOCK_PLATFORMS.map(plat => (
                                    <label key={plat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="platform"
                                            checked={platform === plat}
                                            onChange={() => setPlatform(plat)}
                                            className="w-4 h-4 bg-slate-900 border-slate-700 checked:bg-neon-purple checked:focus:ring-neon-purple focus:ring-neon-purple focus:ring-offset-slate-900 transition-colors"
                                        />
                                        <span className={`text-sm tracking-wide transition-colors ${platform === plat ? 'text-neon-purple font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                                            {plat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Brand</h3>
                            <select
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-neon-blue focus:border-neon-blue block p-2.5 transition-colors cursor-pointer"
                            >
                                {MOCK_BRANDS.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rating Filter Slider placeholder */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Min Gamer Rating ⭐</h3>
                            <input
                                type="range"
                                min="0" max="10" step="1"
                                value={minRating}
                                onChange={(e) => setMinRating(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                            />
                            <div className="mt-2 text-right text-xs font-mono text-neon-blue">{minRating}.0+</div>
                        </div>

                    </GlassPanel>
                </div>
            </aside>

            {/* Main Content - Product Grid */}
            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Settings2 className="h-6 w-6 text-neon-blue" />
                        The Arsenal
                    </h1>
                    <span className="text-slate-400 text-sm font-medium">{products.length} Results</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-96 rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/50"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30">
                        <h3 className="text-xl text-slate-400 font-bold mb-2">NO GEAR FOUND</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters to discover more products.</p>
                        <GlowButton variant="blue" className="mt-6" onClick={() => { setCategory("All"); setPlatform("All"); setBrand("All"); setMinRating(0); }}>
                            Reset Filters
                        </GlowButton>
                    </div>
                )}
            </main>
        </div>
    );
}
