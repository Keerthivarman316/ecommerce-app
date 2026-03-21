"use client";

import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, Clock, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('lootbay_token');
            if (!token) {
                router.push('/auth');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('lootbay_token');
        router.push('/');
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 mt-8 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-neon-blue" />
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight">Operative Profile</h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-colors">
                    <LogOut className="w-5 h-5" /> Terminate Session
                </button>
            </div>

            <div className="flex flex-col gap-8">
                {/* Orders Panel */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6 text-neon-purple" /> Order History
                    </h2>

                    {loading ? (
                        <div className="h-64 rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/50"></div>
                    ) : orders.length === 0 ? (
                        <GlassPanel className="p-12 text-center text-slate-400">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No deployment records found.</p>
                            <p className="text-sm mt-2 opacity-60">Complete a checkout to see your gear tracker here.</p>
                        </GlassPanel>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <GlassPanel key={order.id} className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between border-b border-slate-700 pb-4 mb-4 gap-4">
                                        <div>
                                            <div className="text-sm text-neon-blue font-mono">Order #{order.id}</div>
                                            <div className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-neon-green/10 text-neon-green border border-neon-green/20 mb-2">
                                                <ShieldCheck className="w-3 h-3" /> {order.status.split('|')[0]}
                                            </span>
                                            {order.status.includes('|') && (
                                                <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">
                                                    Via •••• {order.status.split('|')[1]}
                                                </span>
                                            )}
                                            <div className="mt-2 text-xl font-bold text-white text-glow-blue">₹{order.total.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-neon-purple font-black px-2 py-0.5 bg-slate-900 border border-slate-700 rounded shadow-inner">{item.quantity}x</span>
                                                    <span className="text-gray-300 font-medium">{item.productName}</span>
                                                </div>
                                                <span className="text-slate-400 font-mono">₹{item.priceAtPurchase.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
