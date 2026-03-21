"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function ReturnsPage() {
    const steps = [
        { title: "Initiate Return", description: "Go to your profile, select the order, and click 'Return Item' within 30 days of delivery." },
        { title: "Pack Securely", description: "Use the original packaging to ensure the components are protected during transit." },
        { title: "Drop Off", description: "A courier will pick up the package from your address within 24-48 hours." },
        { title: "Refund Sync", description: "Once we inspect the item, the refund is processed instantly to your original payment method." },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-neon-red/10 rounded-2xl border border-neon-red/20">
                        <RefreshCcw className="w-10 h-10 text-neon-red" />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-4 italic uppercase">
                    Returns & <span className="text-neon-red text-glow-red">Refunds</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    We offer a 30-day hassle-free return policy for all components. Your satisfaction is our priority.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-4 h-full relative">
                            <span className="absolute top-2 right-4 text-4xl font-black text-white/5">{idx + 1}</span>
                            <h3 className="font-bold text-white mb-2 relative z-10">{step.title}</h3>
                            <p className="text-xs text-gray-500 relative z-10 leading-relaxed">{step.description}</p>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
            >
                <GlassPanel className="p-8 border-neon-blue/20">
                    <div className="flex items-start gap-4">
                        <ShieldCheck className="w-8 h-8 text-neon-blue shrink-0 mt-1" />
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">30-Day Money Back Guarantee</h2>
                            <p className="text-sm text-gray-400">
                                If you're not happy with your purchase, return it within 30 days for a full refund. No questions asked.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassPanel className="p-6">
                        <div className="flex items-center gap-3 mb-4 text-white font-bold">
                            <AlertCircle className="w-5 h-5 text-neon-red" /> Conditions
                        </div>
                        <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                            <li>Must include all original accessories and manuals.</li>
                            <li>No physical damage or liquid spills.</li>
                            <li>Seals must be intact for processors (CPUs).</li>
                        </ul>
                    </GlassPanel>
                    <GlassPanel className="p-6">
                        <div className="flex items-center gap-3 mb-4 text-white font-bold">
                            <FileText className="w-5 h-5 text-neon-purple" /> Documentation
                        </div>
                        <p className="text-xs text-gray-400">
                            Keep your digital invoice handy. It's sent to your email and stored in your profile dashboard.
                        </p>
                    </GlassPanel>
                </div>
            </motion.div>
        </div>
    );
}
