"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Carousel } from '@/components/ui/Carousel';
import { ProductCard } from '@/components/ui/ProductCard';
import { GlowButton } from '@/components/ui/GlowButton';
import axios from 'axios';

// Mock data fallback to ensure UI looks stunning even if backend is not running
const MOCK_PRODUCTS = [
  { id: '1', productName: "NVIDIA RTX 4090 Founders Edition", price: 1599.99, rating: 4.9, gamerRating: 9.8, reviews: 1204, category: "GPU", brand: "NVIDIA", platform: "PC", stock: 12, performanceTags: ["4K Gaming", "Ray Tracing"], image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=600&fit=crop" },
  { id: '2', productName: "AMD Ryzen 9 7950X3D", price: 699.00, rating: 4.9, gamerRating: 9.7, reviews: 342, category: "CPU", brand: "AMD", platform: "PC", stock: 4, stockUrgency: "Low Stock", performanceTags: ["AM5", "3D V-Cache"], image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&h=600&fit=crop" },
  { id: '3', productName: "Razer DeathAdder V3 Pro", price: 149.99, rating: 4.7, gamerRating: 9.5, reviews: 899, category: "Peripherals", brand: "Razer", platform: "PC", stock: 45, performanceTags: ["Wireless", "Ultra-light"], image: "https://images.unsplash.com/photo-1615663245857-ac93babde8c3?w=600&h=600&fit=crop" },
  { id: '4', productName: "ASUS ROG Swift OLED PG27AQDM", price: 999.00, rating: 4.8, gamerRating: 9.9, reviews: 215, category: "Monitors", brand: "ASUS", platform: "PC", stock: 0, performanceTags: ["1440p", "240Hz", "OLED"], image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=600&h=600&fit=crop" },
  { id: '5', productName: "Sony PlayStation 5 Pro", price: 699.99, rating: 4.8, gamerRating: 9.6, reviews: 450, category: "Consoles", brand: "Sony", platform: "PS5", stock: 2, stockUrgency: "Almost Gone", performanceTags: ["4K", "120Hz"], image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop" },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Attempt to fetch from our backend
        const res = await axios.get('http://localhost:5000/api/products?limit=8');
        if (res.data && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn("Backend not reachable, using stunning mock data for UI showcase.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-20">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] mt-4"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 px-8 py-24 md:px-16 md:py-36 flex flex-col items-start max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="bg-neon-blue/20 text-neon-blue font-bold tracking-widest uppercase text-xs px-3 py-1.5 rounded-full border border-neon-blue/40 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> System Online
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter"
          >
            LEVEL UP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow-blue">SETUP 🎮</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg md:text-xl mb-10 max-w-xl border-l-2 border-neon-blue pl-4 backdrop-blur-sm"
          >
            Access the ultimate arsenal of premium gaming gear, next-gen components, and exclusive drops tailored for elite players.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <GlowButton variant="blue" className="px-8 py-4 text-base">
              Explore Gear <ArrowRight className="w-5 h-5" />
            </GlowButton>
            <Link href="/pc-builder">
              <GlowButton variant="purple" glowOnHoverOnly className="px-8 py-4 text-base bg-transparent border-slate-700 text-white hover:border-neon-purple">
                Start PC Builder
              </GlowButton>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Trending Products Carousel */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Carousel title={
          <span className="flex items-center gap-3">
            Trending Now <Flame className="w-8 h-8 text-neon-red animate-pulse" />
          </span>
        }>
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </Carousel>
      </motion.section>

      {/* Top Gaming Gear Grid */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
            <span className="w-2 h-8 bg-neon-purple rounded-full inline-block shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
            Top Gaming Gear
          </h2>
          <button className="text-neon-purple hover:text-purple-400 font-bold uppercase tracking-wider text-sm flex items-center gap-1 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={`grid-${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* New Arrivals Carousel */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Carousel title="New Component Drops">
          {products.slice().reverse().map((product, i) => (
            <motion.div
              key={`new-${product.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </Carousel>
      </motion.section>

    </div>
  );
}
