'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Package, Truck, CheckCircle2, XCircle, Clock, Search, ExternalLink } from 'lucide-react';

export default function OrderOversight() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    const getStatusIcon = (status: string) => {
        const s = status.split('|')[0].toUpperCase();
        if (s.includes('DELIVERED')) return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
        if (s.includes('CANCELLED')) return <XCircle className="w-4 h-4 text-red-500" />;
        if (s.includes('SHIPPED')) return <Truck className="w-4 h-4 text-amber-500" />;
        return <Clock className="w-4 h-4 text-neon-blue" />;
    };

    if (loading) return <div className="space-y-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl animate-pulse"></div>)}</div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Order Oversight</h1>
                    <p className="text-slate-500 mt-2">Global deployment tracker and logistics management.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Filter by Order ID..."
                        className="pl-10 pr-4 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-neon-blue transition-colors w-64 uppercase font-mono"
                    />
                </div>
            </header>

            <div className="space-y-4">
                {orders.map((order) => (
                    <GlassPanel key={order.id} className="p-6 border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-white/5 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-neon-blue font-mono font-bold uppercase tracking-wider">#{order.id}</span>
                                        <span className="text-slate-600 font-mono text-xs">|</span>
                                        <span className="text-slate-400 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-white font-bold">{order.user.username}</span>
                                        <span className="text-slate-500 text-sm font-medium">({order.user.email})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="text-right mr-4">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Revenue</div>
                                    <div className="text-xl font-black text-white">₹{order.total}</div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                    {getStatusIcon(order.status)}
                                    <select
                                        value={order.status.split('|')[0]}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="bg-transparent text-xs font-black uppercase text-white focus:outline-none cursor-pointer"
                                    >
                                        <option value="PENDING" className="bg-slate-900">Pending</option>
                                        <option value="PROCESSING" className="bg-slate-900">Processing</option>
                                        <option value="SHIPPED" className="bg-slate-900">Shipped</option>
                                        <option value="DELIVERED" className="bg-slate-900">Delivered</option>
                                        <option value="CANCELLED" className="bg-slate-900">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/5 rounded-lg text-xs">
                                    <span className="text-neon-purple font-black">{item.quantity}x</span>
                                    <span className="text-slate-300">{item.productName}</span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
}
