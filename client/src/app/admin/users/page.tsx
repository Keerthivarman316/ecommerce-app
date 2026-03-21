'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { User, Shield, ShieldCheck, Mail, Calendar, Hash } from 'lucide-react';

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-slate-800 rounded-xl"></div>)}</div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">User Management</h1>
                <p className="text-slate-500 mt-2">Manage operative permissions and account roles.</p>
            </header>

            <GlassPanel className="overflow-hidden border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-black">
                            <th className="px-6 py-4">Operative</th>
                            <th className="px-6 py-4">Credentials</th>
                            <th className="px-6 py-4 text-center">Deployments</th>
                            <th className="px-6 py-4">Enlisted On</th>
                            <th className="px-6 py-4 text-right">Clearance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${u.role === 'ADMIN' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-slate-800 text-slate-400'}`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{u.username}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-slate-500" />
                                        {u.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-mono text-neon-blue">
                                    {u._count.orders}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-slate-600" />
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleRole(u.id, u.role)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all border ${u.role === 'ADMIN'
                                                ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue/20'
                                                : 'bg-slate-800 text-slate-400 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {u.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                        {u.role}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>
        </div>
    );
}
