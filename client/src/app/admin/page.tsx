'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { TrendingUp, Users, ShoppingCart, Package, DollarSign, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOverview() {
    const { token } = useAuth();
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
        { name: 'Total Revenue', value: stats ? `₹${stats.totalRevenue}` : '...', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        { name: 'Total Orders', value: stats ? stats.totalOrders : '...', icon: ShoppingCart, color: 'text-neon-blue', bg: 'bg-blue-500/10' },
        { name: 'Active Users', value: stats ? stats.totalUsers : '...', icon: Users, color: 'text-neon-purple', bg: 'bg-purple-500/10' },
        { name: 'Total Inventory', value: stats ? stats.totalProducts : '...', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-slate-800 rounded mb-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Executive Overview</h1>
                <p className="text-slate-500 mt-2">Global system statistics and deployment tracking.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-6 h-full border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                                    <ArrowUpRight className="w-3 h-3" /> +12.5%
                                </span>
                            </div>
                            <div className="text-slate-400 text-sm font-medium">{stat.name}</div>
                            <div className="text-2xl font-black text-white mt-1">{stat.value}</div>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            {/* Mid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassPanel className="lg:col-span-2 p-8 h-80 flex items-center justify-center text-slate-500 border-dashed border-2 border-white/5 font-mono italic">
                    <TrendingUp className="w-8 h-8 mr-3 opacity-20" /> Performance Analytics Visualization Incoming...
                </GlassPanel>

                <GlassPanel className="p-8 h-80 flex flex-col items-center justify-center text-center space-y-4 border-white/5">
                    <div className="w-20 h-20 rounded-full border-4 border-neon-blue border-t-transparent animate-spin-slow"></div>
                    <div>
                        <div className="text-white font-bold">System Integrity</div>
                        <div className="text-neon-blue text-sm">OPTIMAL • 99.9%</div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
