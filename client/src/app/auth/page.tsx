"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlowButton } from '@/components/ui/GlowButton';
import { ShieldCheck, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login Logic
                const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                localStorage.setItem('lootbay_token', res.data.token);
                localStorage.setItem('lootbay_user', JSON.stringify(res.data.user));
                router.push('/'); // Redirect Home
            } else {
                // Register Logic
                const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
                alert("Registration Successful! Please login.");
                setIsLogin(true); // Switch to login screen
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification Failed. System Error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-10">
            <GlassPanel className="w-full max-w-md p-8 relative overflow-hidden">

                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop')] bg-cover opacity-5 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <ShieldCheck className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        {isLogin ? "System Login" : "Register Access"}
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        {isLogin ? "Authenticate to access your arsenal." : "Create your LootBay operative profile."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Operative Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="text" required
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-neon-blue focus:border-neon-blue outline-none transition-colors"
                                    placeholder="xX_Slayer_Xx"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Comm-Link (Email)</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-neon-blue focus:border-neon-blue outline-none transition-colors"
                                placeholder="operative@lootbay.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Encryption Key (Password)</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-neon-blue focus:border-neon-blue outline-none transition-colors"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <GlowButton variant={isLogin ? 'blue' : 'purple'} className="w-full py-4 mt-8" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Authenticate" : "Initialize Profile")}
                    </GlowButton>

                </form>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "No access clearance?" : "Already an operative?"}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-neon-blue font-bold ml-2 hover:text-white transition-colors"
                        >
                            {isLogin ? "Register Here" : "Login Here"}
                        </button>
                    </p>
                </div>

            </GlassPanel>
        </div>
    );
}
