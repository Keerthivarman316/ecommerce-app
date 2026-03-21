"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Package, LogOut, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, token, isLoggedIn, logout, checkAuth } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const hasMounted = useRef(false);

    // Early return to prevent flash of content before redirect
    useEffect(() => {
        checkAuth();
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-[80vh]">
                {/* Silent spacer to prevent footer flash while redirecting in background */}
            </div>
        );
    }

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch order history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only run after client-side hydration to safely access localStorage
        if (hasMounted.current) return;
        hasMounted.current = true;
        fetchOrders();
    }, []); // empty deps - run once on mount only

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Order cancelled successfully.');
            fetchOrders();
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Failed to cancel order.';
            alert(msg);
        }
    };

    // An order can be cancelled if it hasn't been dispatched yet
    const isCancellable = (status: string) => {
        const s = status.split('|')[0].toUpperCase();
        return s !== 'CANCELLED' && s !== 'SHIPPED' && s !== 'DELIVERED';
    };

    const handleLogout = () => {
        logout();
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
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 border ${order.status.includes('CANCELLED') ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                order.status.includes('SHIPPED') ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-neon-green/10 text-neon-green border-neon-green/20'
                                                }`}>
                                                {order.status.includes('CANCELLED') ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                                {order.status.split('|')[0]}
                                            </span>
                                            {order.status.includes('|') && (
                                                <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">
                                                    Via •••• {order.status.split('|')[1]}
                                                </span>
                                            )}
                                            <div className="mt-2 text-xl font-bold text-white text-glow-blue">₹{order.total.toFixed(2)}</div>

                                            {isCancellable(order.status) && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="mt-3 text-xs text-red-400 hover:text-red-300 underline font-bold transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
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
