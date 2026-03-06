"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';

// Mock data for the frontend display
const FEATURED_PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5 Wireless Headphones", price: 348.00, rating: 4.8, reviews: 1204, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop" },
  { id: 2, name: "Apple iPad Pro 12.9-inch (M2)", price: 1099.00, rating: 4.9, reviews: 342, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop" },
  { id: 3, name: "Logitech MX Master 3S Mouse", price: 99.99, rating: 4.7, reviews: 899, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop" },
  { id: 4, name: "Dell UltraSharp 27 4K USB-C Monitor", price: 549.99, rating: 4.6, reviews: 215, image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=600&h=600&fit=crop" },
];

export default function Home() {

  return (
    <div className="flex flex-col gap-12 pb-20">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a2332] to-[#0f172a] border border-gray-800 shadow-2xl mt-6"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        
        <div className="relative px-8 py-20 md:px-16 md:py-32 flex flex-col items-start max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#f3a847] font-bold tracking-wider uppercase text-sm mb-4"
          >
            New Arrival
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
          >
             Next-Gen Gaming <br/> Delivered Today.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl line-clamp-2"
          >
            Experience unparalleled performance with the latest RTX 40-Series gaming laptops. Built for extreme detail and speed.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f3a847] hover:bg-[#f4b563] text-gray-900 font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(243,168,71,0.3)]"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>

      {/* Product Grid Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-[#3b82f6] rounded-full inline-block"></span>
            Featured Products
          </h2>
          <Link href="/products" className="text-[#3b82f6] hover:text-blue-400 font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#1f2937] border border-gray-800 rounded-xl overflow-hidden shadow-lg group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Details */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-gray-200 font-medium line-clamp-2 mb-2 group-hover:text-[#3b82f6] transition-colors h-12">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#f3a847] fill-[#f3a847]' : 'text-gray-600'}`} 
                    />
                  ))}
                  <span className="text-xs text-[#3b82f6] ml-1 hover:underline cursor-pointer">
                    {product.reviews} reviews
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    <span className="text-sm font-normal align-top">$</span>
                    {Math.floor(product.price)}
                    <span className="text-sm font-normal align-top">
                      {(product.price % 1).toFixed(2).substring(1)}
                    </span>
                  </span>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-[#3b82f6] hover:bg-blue-500 text-white p-2.5 rounded-full transition-colors shadow-md"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
