'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ShoppingBag, Box, ChevronLeft, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn || (user && user.role !== 'ADMIN')) {
                router.replace('/');
            }
        }
    }, [isLoggedIn, user, loading, router]);

    if (loading || !isLoggedIn || (user && user.role !== 'ADMIN')) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Box },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#05070a] text-white flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900/50 border-r border-white/5 backdrop-blur-xl flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-neon-blue transition-colors" />
                        <span className="text-xl font-black tracking-tighter">
                            LOOT<span className="text-neon-blue">BAY</span> <span className="text-[10px] bg-neon-blue/20 text-neon-blue px-1.5 py-0.5 rounded border border-neon-blue/30 ml-1">ADMIN</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-neon-blue transition-colors" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Exit Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
