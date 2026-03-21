'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Package, Truck, CheckCircle2, XCircle, Clock, Search, ExternalLink, Terminal, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderOversight() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            alert('Status update failed: Protocol error or insufficient permissions.');
        }
    };

    const getStatusStyle = (status: string) => {
        const s = status.split('|')[0].toUpperCase();
        if (s.includes('DELIVERED')) return { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' };
        if (s.includes('CANCELLED')) return { icon: <XCircle className="w-3 h-3" />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
        if (s.includes('SHIPPED')) return { icon: <Truck className="w-3 h-3" />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
        return { icon: <Clock className="w-3 h-3" />, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20' };
    };

    const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="space-y-4 animate-pulse">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-800 rounded-xl border border-white/5"></div>)}</div>;

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-neon-purple mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logistics.Net / Deployments</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Deployment Matrix</h1>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="SEARCH DEPLOYMENT ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-neon-purple transition-colors uppercase"
                    />
                </div>
            </header>

            <div className="space-y-2">
                {filteredOrders.length === 0 ? (
                    <div className="py-20 text-center text-slate-600 font-mono text-xs uppercase tracking-widest border-2 border-dashed border-white/5 rounded-2xl">
                        No active deployments detected in current sector.
                    </div>
                ) : filteredOrders.map((order, idx) => {
                    const style = getStatusStyle(order.status);
                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassPanel className="p-4 border-white/5 hover:border-white/10 transition-colors bg-white/[0.01]">
                                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full lg:w-1/3">
                                        <div className={`p-3 rounded-xl ${style.bg} ${style.color} border ${style.border}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono font-bold uppercase text-xs tracking-wider">#{order.id}</span>
                                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${style.bg} ${style.color} border ${style.border} flex items-center gap-1`}>
                                                    {style.icon} {order.status.split('|')[0]}
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                                <span>{order.user.username}</span>
                                                <span className="text-slate-700">•</span>
                                                <span className="font-mono text-[8px] lowercase">{order.user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex justify-center lg:justify-start gap-12 w-full lg:w-auto">
                                        <div>
                                            <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Deployment Date</div>
                                            <div className="text-[10px] text-white font-mono">{new Date(order.createdAt).toISOString().split('T')[0]}</div>
                                        </div>
                                        <div>
                                            <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Net Valuation</div>
                                            <div className="text-[10px] text-white font-mono font-bold">₹{order.total.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Items</div>
                                            <div className="text-[10px] text-neon-blue font-mono">{order.items.length} Units</div>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-auto flex justify-end gap-3">
                                        <select
                                            value={order.status.split('|')[0]}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="bg-slate-900 border border-white/10 text-[10px] font-black uppercase text-white px-4 py-2 rounded-lg focus:outline-none focus:border-neon-blue cursor-pointer transition-colors"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                        <button className="p-2 bg-slate-800 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase tracking-widest pl-2 pt-4">
                <Terminal className="w-3 h-3" />
                <span>Global Deployment Stream — Status: Nominal</span>
            </div>
        </div>
    );
}
