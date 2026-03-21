'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Users, Shield, User, Search, RefreshCw, MoreVertical, Terminal } from 'lucide-react';

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
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
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            alert('Operation failed: Insufficient permissions or network error.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-neon-green mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Directory.Root / Operatives</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Operative Registry</h1>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="QUERY OPERATIVE ID/NAME..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-neon-blue transition-colors uppercase"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/5"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            <GlassPanel className="p-0 border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operative Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Administrative Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Count</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Directive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-16 bg-white/5"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-600 font-mono text-xs italic uppercase tracking-widest">No matching operatives found in central database.</td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-neon-blue/20 group-hover:text-neon-blue transition-colors overflow-hidden">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase">{user.username}</div>
                                                <div className="text-[10px] font-mono text-slate-500 lowercase">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-slate-800 text-slate-500'}`}>
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-mono font-bold">{user._count.orders}</span>
                                            <span className="text-[8px] text-slate-600 uppercase font-black">Success Ratio 100%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            {new Date(user.createdAt).toISOString().split('T')[0]}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleRole(user.id, user.role)}
                                            className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
                                        >
                                            {user.role === 'ADMIN' ? 'Revoke Access' : 'Grant Clearance'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>

            <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase tracking-widest pl-2">
                <Terminal className="w-3 h-3" />
                <span>End of Registry Output — Total Operatives: {users.length}</span>
            </div>
        </div>
    );
}
