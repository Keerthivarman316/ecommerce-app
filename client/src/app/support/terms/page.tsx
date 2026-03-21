"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Gavel, Scale } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function TermsPage() {
    const sections = [
        { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account." },
        { title: "Purchases & Payments", content: "All purchases through our site are subject to our acceptance. We may refuse or cancel any order for any reason, including errors in product pricing or availability." },
        { title: "Intellectual Property", content: "The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and trademarks." },
        { title: "Limitation of Liability", content: "LootBay shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site." },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-slate-800 rounded-2xl border border-white/5">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-4 italic uppercase">
                    Terms of <span className="text-neon-blue text-glow-blue">Service</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Please read these terms carefully before using the LootBay marketplace.
                </p>
            </motion.div>

            <div className="space-y-6 mb-16">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                {idx === 0 && <Shield className="w-5 h-5 text-neon-blue" />}
                                {idx === 1 && <Gavel className="w-5 h-5 text-neon-purple" />}
                                {idx === 2 && <Scale className="w-5 h-5 text-neon-blue" />}
                                {idx === 3 && <Shield className="w-5 h-5 text-neon-red" />}
                                {section.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {section.content}
                            </p>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center p-8 border-t border-white/5"
            >
                <p className="text-xs text-gray-500 italic">
                    Last updated: October 2023. LootBay reserves the right to update these terms at any time.
                </p>
            </motion.div>
        </div>
    );
}
