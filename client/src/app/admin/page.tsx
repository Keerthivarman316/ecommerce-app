'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { TrendingUp, Users, ShoppingCart, Package, DollarSign, ArrowUpRight, Activity, Terminal, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOverview() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, [token]);

    const statCards = [
        { name: 'NET REVENUE', value: stats ? `₹${stats.totalRevenue}` : '...', icon: DollarSign, color: 'text-neon-blue', bg: 'bg-blue-500/10' },
        { name: 'TOTAL DEPLOYMENTS', value: stats ? stats.totalOrders : '...', icon: ShoppingCart, color: 'text-neon-purple', bg: 'bg-purple-500/10' },
        { name: 'ACTIVE OPERATIVES', value: stats ? stats.totalUsers : '...', icon: Users, color: 'text-neon-green', bg: 'bg-emerald-500/10' },
        { name: 'GEAR MANIFEST', value: stats ? stats.totalProducts : '...', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-slate-800 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl border border-white/5"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-neon-blue mb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">System.Root / Overview</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Command Center</h1>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Local Timestamp</div>
                    <div className="text-white font-mono font-bold">{new Date().toLocaleTimeString()}</div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-6 h-full border-white/5 hover:border-neon-blue/20 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <stat.icon className="w-20 h-20" />
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="flex items-center text-[10px] font-black text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded border border-neon-green/20">
                                    <Activity className="w-3 h-3 mr-1" /> OPTIMAL
                                </span>
                            </div>
                            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.name}</div>
                            <div className="text-3xl font-black text-white font-mono tracking-tighter">{stat.value}</div>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            {/* Analytics & System Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulated Chart Placeholder */}
                <GlassPanel className="lg:col-span-2 p-8 border-white/5 relative overflow-hidden flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-neon-blue" /> Network Performance
                        </h3>
                        <div className="flex gap-2">
                            {['1H', '24H', '7D'].map(t => (
                                <button key={t} className={`text-[10px] font-black px-2 py-1 rounded border transition-colors ${t === '24H' ? 'border-neon-blue text-neon-blue bg-neon-blue/10' : 'border-white/5 text-slate-500 hover:text-white'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-end gap-1">
                        <div className="flex items-end gap-1 h-48">
                            {[40, 70, 45, 90, 65, 80, 50, 85, 40, 95, 60, 75, 55, 90, 45].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 1 }}
                                    className="flex-1 bg-gradient-to-t from-neon-blue/40 to-neon-blue/10 border-t border-neon-blue/50 rounded-t-sm"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-700 font-mono py-2 uppercase tracking-widest border-t border-white/5">
                            <span>00:00 UTC</span>
                            <span>System Baseline Analytics</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </GlassPanel>

                {/* System Log / Security */}
                <GlassPanel className="p-0 border-white/5 flex flex-col h-[400px]">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Shield className="w-4 h-4 text-neon-purple" /> Security Log
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[10px]">
                        {[
                            { time: '12:45:02', event: 'ADMIN_ACCESS_GRANTED', user: user?.email, status: 'SECURE' },
                            { time: '12:40:15', event: 'DB_SYNC_COMPLETE', user: 'SYSTEM', status: 'SUCCESS' },
                            { time: '12:35:50', event: 'NEW_DEPO_REGISTERED', user: 'ORD_9421', status: 'PENDING' },
                            { time: '12:15:22', event: 'STOCK_THRESHOLD_ALERT', user: 'PRD_4090', status: 'WARNING' },
                            { time: '12:00:00', event: 'CRON_INVENTORY_AUDIT', user: 'SYSTEM', status: 'COMPLETE' },
                        ].map((log, i) => (
                            <div key={i} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0">
                                <div className="flex justify-between text-slate-500">
                                    <span>[{log.time}]</span>
                                    <span className={log.status === 'SECURE' || log.status === 'SUCCESS' ? 'text-neon-green' : log.status === 'WARNING' ? 'text-amber-500' : 'text-neon-blue'}>{log.status}</span>
                                </div>
                                <div className="text-white font-bold">{log.event}</div>
                                <div className="text-slate-600 truncate">ID: {log.user}</div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
