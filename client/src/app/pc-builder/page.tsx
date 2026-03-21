"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Monitor, HardDrive, Zap, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlowButton } from '@/components/ui/GlowButton';
import { useStore } from '@/context/StoreContext';

import axios from 'axios';

interface BuilderStep {
    id: string;
    label: string;
    icon: any;
    options: any[];
}

const UI_STEPS_TEMPLATE = [
    { id: 'cpu', label: 'Processor', icon: Cpu },
    { id: 'mobo', label: 'Motherboard', icon: Monitor },
    { id: 'ram', label: 'Memory', icon: HardDrive },
    { id: 'gpu', label: 'Graphics Card', icon: Zap }
];

export default function PCBuilderPage() {
    const { addToCart } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [build, setBuild] = useState<Record<string, any>>({});

    // Data Loading & Compilation Status
    const [loadingDb, setLoadingDb] = useState(true);
    const [dynamicSteps, setDynamicSteps] = useState<BuilderStep[]>([]);

    // Dynamically query database components once mounted
    React.useEffect(() => {
        const fetchComponents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products?limit=100');
                const products = res.data.products;

                const cpus = products.filter((p: any) => p.category === 'CPU');
                const mobos = products.filter((p: any) => p.category === 'Motherboard');
                const rams = products.filter((p: any) => p.category === 'RAM');
                const gpus = products.filter((p: any) => p.category === 'GPU');

                // Only include steps that have at least one DB option
                const allSteps: BuilderStep[] = [
                    { ...UI_STEPS_TEMPLATE[0], options: cpus },
                    { ...UI_STEPS_TEMPLATE[1], options: mobos },
                    { ...UI_STEPS_TEMPLATE[2], options: rams },
                    { ...UI_STEPS_TEMPLATE[3], options: gpus }
                ];
                const availableSteps = allSteps.filter(s => s.options.length > 0);
                setDynamicSteps(availableSteps);
            } catch (error) {
                console.error("Failed to load component architectures", error);
            } finally {
                setLoadingDb(false);
            }
        };
        fetchComponents();
    }, []);

    const activeStepData = dynamicSteps[currentStep];

    // Compatibility logic (using hardware attributes organically stored in DB)
    const cpuSocket = build['cpu']?.compatibility || build['cpu']?.productName.includes('Intel') ? 'Intel LGA' : build['cpu']?.productName.includes('Ryzen') ? 'AMD AM5' : null;
    const moboSocket = build['mobo']?.compatibility || build['mobo']?.productName.includes('Z790') ? 'Intel LGA' : build['mobo']?.productName.includes('B650') ? 'AMD AM5' : null;

    const hasCompatibilityError = cpuSocket && moboSocket && cpuSocket !== moboSocket;

    const total = Object.values(build).reduce((sum, item) => sum + Number(item.price), 0);

    const handleSelect = (item: any) => {
        setBuild({ ...build, [activeStepData.id]: item });
        if (currentStep < dynamicSteps.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        }
    };

    const addAllToCart = () => {
        const selected = Object.values(build);
        if (selected.length === 0) {
            alert('Select at least one component to build your rig!');
            return;
        }
        selected.forEach(item => addToCart(item));
        alert(`${selected.length} component(s) deployed to Cart! 🚀`);
    };

    // Build is ready when all available (non-empty) steps have a selection
    const availableStepIds = dynamicSteps.map(s => s.id);
    const allAvailableSelected = availableStepIds.length > 0 && availableStepIds.every(id => build[id]);

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
                        {loadingDb ? <span className="text-slate-500 animate-pulse px-4 py-2">Loading Core Components...</span> : dynamicSteps.map((step, idx) => {
                            const Icon = step.icon;
                            let isComplete = false;

                            if (build && step && build[step.id]) {
                                isComplete = true;
                            }
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
                                {activeStepData?.options?.length === 0 ? (
                                    <div className="col-span-2 flex flex-col items-center justify-center h-48 text-slate-600">
                                        <ShieldAlert className="w-10 h-10 mb-3 opacity-50" />
                                        <p className="font-semibold">No {activeStepData?.label} found in inventory.</p>
                                        <p className="text-sm mt-1 opacity-70">This category has no stocked products.</p>
                                    </div>
                                ) : activeStepData?.options?.map((option: any) => {
                                    const isSelected = build[activeStepData.id]?.id === option.id;

                                    let isWarning = false;
                                    if (activeStepData.id === 'mobo' && cpuSocket && cpuSocket !== (option.compatibility || (option.productName.includes('Z790') ? 'Intel LGA' : 'AMD AM5'))) isWarning = true;
                                    if (activeStepData.id === 'cpu' && moboSocket && moboSocket !== (option.compatibility || (option.productName.includes('Intel') ? 'Intel LGA' : 'AMD AM5'))) isWarning = true;

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
                                                <h4 className={`font-bold ${isSelected ? 'text-neon-blue' : 'text-slate-200'} line-clamp-2`}>{option.productName}</h4>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                <span className="text-xs text-slate-500 uppercase tracking-widest">{option.compatibility || option.brand || '-'}</span>
                                                <span className="text-lg font-black text-white">₹{Number(option.price).toLocaleString()}</span>
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
                                {loadingDb ? <span className="text-slate-500 animate-pulse text-sm">System connecting...</span> : dynamicSteps.map(step => {
                                    const item = build[step.id];
                                    return (
                                        <div key={`summary-${step.id}`} className="flex justify-between items-start">
                                            <div>
                                                <span className="block text-xs text-slate-500 uppercase">{step.label}</span>
                                                <span className={`text-sm ${item ? 'text-white line-clamp-1' : 'text-slate-700 italic'}`}>
                                                    {item ? item.productName : 'Select a component'}
                                                </span>
                                            </div>
                                            {item && <span className="text-sm font-bold text-slate-300 shrink-0 mx-2">₹{Number(item.price).toLocaleString()}</span>}
                                        </div>
                                    );
                                })}
                            </div> <div className="border-t border-slate-700 pt-6 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Power</span>
                                    <span className="text-3xl font-black text-white text-glow-blue">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <GlowButton
                                variant="blue"
                                className="w-full py-4 text-lg flex items-center justify-center gap-2"
                                disabled={!allAvailableSelected || hasCompatibilityError || loadingDb}
                                onClick={addAllToCart}
                            >
                                {loadingDb ? 'Fetching Models...' : !allAvailableSelected ? `Select all ${availableStepIds.length} components` : 'Deploy to Cart 🚀'}
                            </GlowButton>
                        </GlassPanel>
                    </div>
                </div>

            </div>
        </div>
    );
}
