"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Globe, MapPin, Clock } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function ShippingPage() {
    const shippingMethods = [
        { icon: <Clock className="w-6 h-6 text-neon-blue" />, name: "Standard Delivery", time: "3-5 Business Days", cost: "Free for orders above ₹20,000" },
        { icon: <Truck className="w-6 h-6 text-neon-purple" />, name: "Express Shipping", time: "1-2 Business Days", cost: "₹500 flat rate" },
        { icon: <Globe className="w-6 h-6 text-neon-blue" />, name: "International", time: "7-15 Business Days", cost: "Calculated at checkout" },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-neon-purple/10 rounded-2xl border border-neon-purple/20">
                        <Truck className="w-10 h-10 text-neon-purple" />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-4 italic uppercase">
                    Shipping <span className="text-neon-purple text-glow-purple">Info</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    We ship worldwide. Track your setup components and get them delivered to your door.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {shippingMethods.map((method, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-6 h-full flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-slate-800 rounded-xl">
                                {method.icon}
                            </div>
                            <h3 className="font-bold text-white mb-1">{method.name}</h3>
                            <p className="text-neon-blue font-semibold text-sm mb-2">{method.time}</p>
                            <p className="text-xs text-gray-500">{method.cost}</p>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
            >
                <GlassPanel className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-neon-blue" />
                        Delivery Guarantee
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-white mb-2">Secure Packaging</h4>
                            <p className="text-sm text-gray-400">
                                All components (especially GPUs and CPUs) are packed in static-shielding bags and multi-layered impact-resistant containers.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2">Insured Shipping</h4>
                            <p className="text-sm text-gray-400">
                                Every order is fully insured against theft or transit damage. If anything happens, we replace it instantly.
                            </p>
                        </div>
                    </div>
                </GlassPanel>
            </motion.div>
        </div>
    );
}
