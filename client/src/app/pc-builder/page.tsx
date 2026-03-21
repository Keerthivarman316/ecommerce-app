"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Monitor, HardDrive, Zap, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlowButton } from '@/components/ui/GlowButton';
import { useStore } from '@/context/StoreContext';

import axios from 'axios';

const STEPS = [
    {
        id: 'cpu', label: 'Processor', icon: Cpu, options: [
            { id: 'c1', name: 'Intel Core i9-14900K', price: 54000, socket: 'LGA1700', dbSearch: '14900K' },
            { id: 'c2', name: 'AMD Ryzen 9 7950X3D', price: 62000, socket: 'AM5', dbSearch: '7950X3D' },
        ]
    },
    {
        id: 'mobo', label: 'Motherboard', icon: Monitor, options: [
            { id: 'm1', name: 'ASUS ROG Maximus Z790 Hero', price: 55000, socket: 'LGA1700', dbSearch: 'Z790 Hero' },
            { id: 'm2', name: 'MSI MPG B650 Carbon WiFi', price: 28000, socket: 'AM5', dbSearch: 'B650' },
        ]
    },
    {
        id: 'ram', label: 'Memory', icon: HardDrive, options: [
            { id: 'r1', name: 'Corsair Dominator Titanium DDR5', price: 22000, dbSearch: 'Dominator' },
            { id: 'r2', name: 'G.Skill Trident Z5 RGB DDR5', price: 18000, dbSearch: 'Trident' },
        ]
    },
    {
        id: 'gpu', label: 'Graphics Card', icon: Zap, options: [
            { id: 'g1', name: 'NVIDIA GeForce RTX 4090', price: 165000, dbSearch: '4090' },
            { id: 'g2', name: 'AMD Radeon RX 7900 XTX', price: 90000, dbSearch: '7900 XTX' },
        ]
    }
];

export default function PCBuilderPage() {
    const { addToCart } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [build, setBuild] = useState<Record<string, any>>({});

    const activeStepData = STEPS[currentStep];

    // Compatibility logic (simplified for UI demonstration)
    const cpuSocket = build['cpu']?.socket;
    const moboSocket = build['mobo']?.socket;

    const hasCompatibilityError = cpuSocket && moboSocket && cpuSocket !== moboSocket;

    const total = Object.values(build).reduce((sum, item) => sum + item.price, 0);

    const handleSelect = (item: any) => {
        setBuild({ ...build, [activeStepData.id]: item });
        if (currentStep < STEPS.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        }
    };

    const [deploying, setDeploying] = useState(false);

    const addAllToCart = async () => {
        setDeploying(true);
        try {
            for (const item of Object.values(build)) {
                // Map the theoretical build selection into a native DB product node ID
                const res = await axios.get(`http://localhost:5000/api/products?search=${encodeURIComponent(item.dbSearch)}`);
                const dbProducts = res.data.products;

                if (dbProducts && dbProducts.length > 0) {
                    addToCart(dbProducts[0]);
                } else {
                    alert(`System Warning: ${item.name} is currently out of stock bounds and could not be appended.`);
                }
            }
            alert("Rig successfully compiled and deployed to Cart! 🚀");
        } catch (error) {
            console.error("Rig compilation failed:", error);
        } finally {
            setDeploying(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 mt-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center justify-center gap-3">
                    <Zap className="w-10 h-10 text-neon-purple" />
                    Rig <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Architect</span>
                </h1>
                <p className="text-slate-400">Construct your dream machine. We automatically verify compatibility.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Component Selection */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Progress Tabs */}
                    <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                        {STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const isComplete = !!build[step.id];
                            const isActive = currentStep === idx;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(idx)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-t-xl border-b-2 whitespace-nowrap transition-colors ${isActive ? 'bg-slate-800/80 border-neon-blue text-white' :
                                        isComplete ? 'bg-slate-900/50 border-neon-green text-slate-300' :
                                            'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isComplete && !isActive ? 'text-neon-green' : ''}`} />
                                    <span className="font-semibold">{step.label}</span>
                                    {isComplete && <CheckCircle2 className="w-3 h-3 text-neon-green ml-1" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Options Grid */}
                    <GlassPanel className="p-6 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {activeStepData.options.map((option: any) => {
                                    const isSelected = build[activeStepData.id]?.id === option.id;

                                    let isWarning = false;
                                    if (activeStepData.id === 'mobo' && cpuSocket && cpuSocket !== option.socket) isWarning = true;
                                    if (activeStepData.id === 'cpu' && moboSocket && moboSocket !== option.socket) isWarning = true;

                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => handleSelect(option)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                                                isWarning ? 'bg-slate-900/40 border-slate-800 opacity-50' :
                                                    'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className={`font-bold ${isSelected ? 'text-neon-blue' : 'text-slate-200'}`}>{option.name}</h4>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <span className="text-xs text-slate-500 uppercase tracking-widest">{option.socket || '-'}</span>
                                                <span className="text-lg font-black text-white">₹{option.price.toLocaleString()}</span>
                                            </div>

                                            {isWarning && (
                                                <div className="mt-4 flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                                                    <AlertTriangle className="w-3 h-3" /> Incompatible with selected {activeStepData.id === 'mobo' ? 'CPU' : 'Motherboard'} socket
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </GlassPanel>

                </div>

                {/* Right: Build Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28">
                        <GlassPanel className="p-6">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-6 border-b border-slate-700 pb-4">
                                Your Loadout
                            </h3>

                            {hasCompatibilityError && (
                                <div className="mb-6 bg-red-900/40 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-200">
                                        <strong className="text-red-400 block mb-1">Compatibility Error Detected</strong>
                                        Motherboard socket ({moboSocket}) does not match CPU socket ({cpuSocket}).
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 mb-8 min-h-[200px]">
                                {STEPS.map(step => {
                                    const item = build[step.id];
                                    return (
                                        <div key={`summary-${step.id}`} className="flex justify-between items-start">
                                            <div>
                                                <span className="block text-xs text-slate-500 uppercase">{step.label}</span>
                                                <span className={`text-sm ${item ? 'text-white' : 'text-slate-700 italic'}`}>
                                                    {item ? item.name : 'Select a component'}
                                                </span>
                                            </div>
                                            {item && <span className="text-sm font-bold text-slate-300 shrink-0">₹{item.price.toLocaleString()}</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-slate-700 pt-6 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Power</span>
                                    <span className="text-3xl font-black text-white text-glow-blue">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <GlowButton
                                variant="blue"
                                className="w-full py-4 text-lg flex items-center justify-center gap-2"
                                disabled={Object.keys(build).length === 0 || hasCompatibilityError || deploying}
                                onClick={addAllToCart}
                            >
                                {deploying ? "Fetching Models..." : "Deploy to Cart 🚀"}
                            </GlowButton>
                        </GlassPanel>
                    </div>
                </div>

            </div>
        </div>
    );
}
