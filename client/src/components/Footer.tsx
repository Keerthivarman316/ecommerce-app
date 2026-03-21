import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Disc } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-white/5 bg-slate-900/40 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-6 w-6 text-neon-blue" />
                            <span className="text-2xl font-black tracking-tighter text-white">
                                LOOT<span className="text-neon-blue">BAY</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Level up your setup with premium gaming gear, components, and exclusives. Built for gamers, by gamers.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-neon-purple transition-colors">
                                <Disc className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Marketplace</h3>
                        <ul className="space-y-3">
                            <li><Link href="/products" className="text-gray-400 hover:text-neon-blue transition-colors">All Products</Link></li>
                            <li><Link href="/pc-builder" className="text-gray-400 hover:text-neon-purple transition-colors">PC Builder</Link></li>
                            <li><Link href="/products?category=GPU" className="text-gray-400 hover:text-neon-blue transition-colors">Graphics Cards</Link></li>
                            <li><Link href="/products?category=Peripherals" className="text-gray-400 hover:text-neon-blue transition-colors">Peripherals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} LootBay. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">System Online</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
