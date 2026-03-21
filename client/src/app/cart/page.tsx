"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ChevronRight, AlertCircle, ShieldCheck, Minus, Plus, Loader2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import Link from 'next/link';
import axios from 'axios';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 1000 ? 0 : 25;
    const total = subtotal + tax + shipping;

    const handleCheckout = async () => {
        const token = localStorage.getItem('lootbay_token');

        if (!token) {
            alert("Please Login or Register to checkout!");
            window.location.href = '/auth'; // Standard window redirect to trigger full load or router redirect
            return;
        }

        setIsCheckingOut(true);
        setCheckoutMessage(null);

        try {
            // Send items to backend because Cart exists entirely on frontend localstorage context
            const payloadItems = cart.map(item => ({ productId: item.id, quantity: item.quantity }));

            const res = await axios.post('http://localhost:5000/api/payment/checkout', { items: payloadItems }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCheckoutMessage(res.data.message);
            clearCart(); // Clear local cart on success
        } catch (err: any) {
            console.error(err);
            setCheckoutMessage(err.response?.data?.message || "Payment Gateway Error. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 mt-8">
            <div className="flex items-center gap-3 mb-10">
                <ShoppingBag className="w-8 h-8 text-neon-blue" />
                <h1 className="text-4xl font-black text-white uppercase tracking-tight">Your Cart</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                    {checkoutMessage ? (
                        <GlassPanel className={`p-12 text-center ${checkoutMessage.includes("successful") ? "border-neon-green" : "border-red-500"}`}>
                            {checkoutMessage.includes("successful") ? <ShieldCheck className="w-16 h-16 text-neon-green mx-auto mb-4" /> : <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
                            <h2 className={`text-2xl font-bold mb-2 ${checkoutMessage.includes("successful") ? "text-white" : "text-red-400"}`}>{checkoutMessage}</h2>
                            <p className="text-slate-400 mb-6">{checkoutMessage.includes("successful") ? "Thank you for leveling up with LootBay!" : "Please refresh or try another method."}</p>
                            <Link href={checkoutMessage.includes("successful") ? "/products" : "/cart"} onClick={() => { if (!checkoutMessage.includes("successful")) setCheckoutMessage(null); }}>
                                <GlowButton variant={checkoutMessage.includes("successful") ? "blue" : "purple"}>Return to Arsenal</GlowButton>
                            </Link>
                        </GlassPanel>
                    ) : cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700/50 rounded-2xl bg-slate-900/10">
                            <ShoppingBag className="w-16 h-16 text-slate-700 mb-4" />
                            <h2 className="text-xl font-bold text-slate-400 mb-2">YOUR CART IS EMPTY</h2>
                            <Link href="/products">
                                <GlowButton variant="blue" className="mt-4">Start Browsing</GlowButton>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                        <GlassPanel className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                                            <div className="w-24 h-24 shrink-0 bg-black/40 rounded-xl flex items-center justify-center p-2 relative overflow-hidden group">
                                                {item.image ? <img src={item.image} alt={item.productName} className="object-contain w-full h-full" /> : <span className="text-slate-800">LOOT</span>}
                                            </div>

                                            <div className="flex-grow text-center sm:text-left">
                                                <span className="text-xs text-neon-blue font-bold uppercase tracking-widest">{item.brand}</span>
                                                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.productName}</h3>
                                                <span className="text-glow-blue text-neon-blue font-bold">₹{item.price.toFixed(2)} / ea</span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-neon-blue transition-colors text-slate-400 disabled:opacity-50" disabled={item.quantity <= 1}><Minus className="w-4 h-4" /></button>
                                                    <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-neon-blue transition-colors text-slate-400"><Plus className="w-4 h-4" /></button>
                                                </div>

                                                <span className="text-2xl font-black text-white shrink-0 w-32 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>

                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-neon-red p-2 rounded-full hover:bg-neon-red/10 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </GlassPanel>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {!checkoutMessage && (
                    <div className="lg:w-1/3">
                        <div className="sticky top-28">
                            <GlassPanel className="p-6 sm:p-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight border-b border-slate-700/50 pb-6 mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-slate-400"><span>Subtotal</span><span className="text-white font-medium">₹{subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center text-slate-400"><span>Estimated Tax (8%)</span><span className="text-white font-medium">₹{tax.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>Shipping</span>
                                        {shipping === 0 ? <span className="text-neon-green font-bold uppercase text-sm tracking-wide">Free</span> : <span className="text-white font-medium">₹{shipping.toFixed(2)}</span>}
                                    </div>
                                </div>

                                <div className="border-t border-slate-700/50 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Power</span>
                                        <span className="text-4xl font-black text-white text-glow-blue">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <GlowButton onClick={handleCheckout} variant="blue" className="w-full py-4 text-lg justify-between px-6" disabled={cart.length === 0 || isCheckingOut}>
                                    <span>{isCheckingOut ? "Processing Link..." : "Secure Checkout"}</span>
                                    {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5 opacity-70" />}
                                </GlowButton>
                            </GlassPanel>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
