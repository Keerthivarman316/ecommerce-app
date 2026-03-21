"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageSquare, Book, ShieldQuestion } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function HelpCenterPage() {
    const categories = [
        { icon: <ShieldQuestion className="w-6 h-6 text-neon-blue" />, title: "Getting Started", description: "New to LootBay? Learn how to set up your account and start shopping." },
        { icon: <Book className="w-6 h-6 text-neon-purple" />, title: "Buying Guide", description: "Everything you need to know about purchasing components and gear." },
        { icon: <MessageSquare className="w-6 h-6 text-neon-blue" />, title: "Contact Support", description: "Can't find what you're looking for? Reach out to our 24/7 support team." },
    ];

    const faqs = [
        { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking number via email. You can also track it from your profile dashboard." },
        { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and net banking. All transactions are secured through encrypted gateways." },
        { q: "Can I cancel my PC build?", a: "Yes, you can cancel your order from your profile page as long as it has not been dispatched yet." },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-neon-blue/10 rounded-2xl border border-neon-blue/20">
                        <HelpCircle className="w-10 h-10 text-neon-blue" />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-4 italic uppercase">
                    Help <span className="text-neon-blue text-glow-blue">Center</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Search our knowledge base or browse categories below to find answers to your questions.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassPanel className="p-6 h-full flex flex-col items-center text-center hover:border-neon-blue/50 transition-colors cursor-pointer group">
                            <div className="mb-4 p-3 bg-slate-800 rounded-xl group-hover:bg-neon-blue/10 transition-colors">
                                {cat.icon}
                            </div>
                            <h3 className="font-bold text-white mb-2">{cat.title}</h3>
                            <p className="text-sm text-gray-500">{cat.description}</p>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                    <div className="w-1 h-8 bg-neon-blue rounded-full"></div>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <GlassPanel key={idx} className="p-6 border-white/5">
                            <h4 className="font-bold text-neon-blue mb-2">Q: {faq.q}</h4>
                            <p className="text-gray-400">A: {faq.a}</p>
                        </GlassPanel>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
