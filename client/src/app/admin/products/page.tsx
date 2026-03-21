'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Package, Plus, Edit2, Trash2, Search, Filter, Save, X } from 'lucide-react';

export default function ProductInventory() {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const startEdit = (product: any) => {
        setEditingId(product.id);
        setEditForm({ ...product });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/${editingId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            alert('Failed to update product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>)}</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Inventory Control</h1>
                    <p className="text-slate-500 mt-2">Manage your gear manifest and global stock levels.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-neon-blue text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20">
                    <Plus className="w-5 h-5" /> Add Component
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                    <GlassPanel key={product.id} className="p-0 overflow-hidden border-white/5 group hover:border-white/10 transition-colors">
                        <div className="h-40 bg-slate-900 flex items-center justify-center p-4 border-b border-white/5 relative">
                            {product.image ? (
                                <img src={product.image} alt={product.productName} className="h-full object-contain" />
                            ) : (
                                <Package className="w-12 h-12 text-slate-800" />
                            )}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(product)} className="p-2 bg-slate-800 rounded text-neon-blue hover:text-white"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 bg-slate-800 rounded text-red-400 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="p-6">
                            {editingId === product.id ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editForm.productName}
                                        onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                    />
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase text-slate-500">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase text-slate-500">Stock</label>
                                            <input
                                                type="number"
                                                value={editForm.stock}
                                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdate} className="flex-1 bg-neon-blue text-white text-xs font-black py-2 rounded-lg flex items-center justify-center gap-2"><Save className="w-3 h-3" /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-800 text-white text-xs font-black py-2 rounded-lg flex items-center justify-center gap-2"><X className="w-3 h-3" /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="text-white font-bold leading-tight">{product.productName}</div>
                                        <div className="text-neon-blue font-black font-mono tracking-tighter text-lg">₹{Number(product.price).toFixed(0)}</div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-white/5">{product.category}</span>
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-white/5">{product.brand}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                                        <span className="text-slate-500 uppercase tracking-widest font-black">Stock Level</span>
                                        <span className={`font-mono font-bold ${product.stock < 10 ? 'text-red-400' : 'text-neon-green'}`}>{product.stock} Units</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
}
