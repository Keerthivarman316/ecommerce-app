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
        <div className="min-h-screen bg-[#020408] text-white flex overflow-hidden">
            {/* Background Grid Accent */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-950/80 border-r border-white/10 backdrop-blur-2xl flex flex-col h-screen sticky top-0 z-50">
                <div className="p-8 border-b border-white/5 bg-slate-900/20">
                    <Link href="/" className="flex flex-col gap-1 group">
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-neon-blue transition-colors" />
                            <span className="text-xl font-black tracking-tighter uppercase">
                                LOOT<span className="text-neon-blue">BAY</span>
                            </span>
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mt-2 pl-6">Mission Control</span>
                    </Link>
                </div>

                <div className="mt-8 px-4 flex-1">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Core Systems</div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-neon-blue hover:bg-neon-blue/5 transition-all group"
                            >
                                <item.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-6 border-t border-white/5 space-y-4">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-neon-green">
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{user?.email}</div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <header className="h-20 border-b border-white/5 flex items-center px-12 sticky top-0 bg-[#020408]/80 backdrop-blur-md z-40">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Terminal</span>
                        <span>/</span>
                        <span className="text-neon-blue">HQ</span>
                    </div>
                </header>
                <div className="p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
