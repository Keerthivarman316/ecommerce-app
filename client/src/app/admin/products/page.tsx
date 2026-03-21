'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Package, Plus, Edit2, Trash2, Search, Filter, Save, X, Image as ImageIcon } from 'lucide-react';

export default function ProductInventory() {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [newProduct, setNewProduct] = useState<any>({
        productName: '',
        price: 0,
        stock: 0,
        category: 'Processor',
        brand: '',
        description: '',
        image: ''
    });

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products?limit=100');
            setProducts(res.data.products || []);
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

    const handleAddProduct = async () => {
        try {
            await axios.post('http://localhost:5000/api/products', newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdding(false);
            setNewProduct({
                productName: '',
                price: 0,
                stock: 0,
                category: 'Processor',
                brand: '',
                description: '',
                image: ''
            });
            fetchProducts();
        } catch (error) {
            alert('Failed to add product');
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
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-neon-blue text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20"
                    >
                        <Plus className="w-5 h-5" /> Add Component
                    </button>
                )}
            </header>

            {/* Add Product Section */}
            {isAdding && (
                <GlassPanel className="p-8 border-neon-blue/30 shadow-lg shadow-neon-blue/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5 text-neon-blue" /> Register New Component
                        </h2>
                        <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="space-y-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-slate-500 font-bold uppercase text-[10px]">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.productName}
                                        onChange={e => setNewProduct({ ...newProduct, productName: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue outline-none transition-colors"
                                        placeholder="e.g. NVIDIA RTX 5090 Ti"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-slate-500 font-bold uppercase text-[10px]">Brand</label>
                                    <input
                                        type="text"
                                        value={newProduct.brand}
                                        onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue outline-none transition-colors"
                                        placeholder="e.g. ASUS"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-slate-500 font-bold uppercase text-[10px]">Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue outline-none transition-colors"
                                    >
                                        <option value="Processor">Processor</option>
                                        <option value="Motherboard">Motherboard</option>
                                        <option value="Graphics Card">Graphics Card</option>
                                        <option value="Memory">Memory</option>
                                        <option value="Storage">Storage</option>
                                        <option value="Power Supply">Power Supply</option>
                                        <option value="Cabinet">Cabinet</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Peripherals">Peripherals</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-slate-500 font-bold uppercase text-[10px]">Price (INR)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-slate-500 font-bold uppercase text-[10px]">Initial Stock</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5 flex flex-col h-full">
                                <label className="text-slate-500 font-bold uppercase text-[10px]">Image URL</label>
                                <div className="flex-1 min-h-[100px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-neon-blue group transition-colors relative overflow-hidden">
                                    {newProduct.image ? (
                                        <img src={newProduct.image} className="absolute inset-0 w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-slate-700 group-hover:text-neon-blue transition-colors" />
                                            <span className="text-[10px] text-slate-600">Visual Manifest</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full mt-2 bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white text-xs focus:border-neon-blue outline-none transition-colors"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-3">
                        <button onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-lg text-slate-500 font-bold hover:bg-white/5 transition-colors">Discard</button>
                        <button onClick={handleAddProduct} className="px-10 py-2 bg-neon-blue text-white font-black uppercase tracking-widest text-sm rounded-lg shadow-lg shadow-neon-blue/20">Commit to Inventory</button>
                    </div>
                </GlassPanel>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-20 text-center animate-pulse">
                        <Package className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <div className="text-slate-600 font-mono">NO INVENTORY RECORDS DETECTED</div>
                    </div>
                ) : products.map((product) => (
                    <GlassPanel key={product.id} className="p-0 overflow-hidden border-white/5 group hover:border-white/10 transition-colors">
                        <div className="h-40 bg-slate-900 flex items-center justify-center p-4 border-b border-white/5 relative">
                            {product.image ? (
                                <img src={product.image} alt={product.productName} className="h-full object-contain" />
                            ) : (
                                <Package className="w-12 h-12 text-slate-800" />
                            )}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(product)} className="p-2 bg-slate-800 rounded text-neon-blue hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 bg-slate-800 rounded text-red-400 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="p-6">
                            {editingId === product.id ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editForm.productName}
                                        onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-neon-blue outline-none"
                                    />
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase text-slate-500 font-bold">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-neon-blue outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase text-slate-500 font-bold">Stock</label>
                                            <input
                                                type="number"
                                                value={editForm.stock}
                                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-neon-blue outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={handleUpdate} className="flex-1 bg-neon-blue text-white text-xs font-black py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neon-blue/20"><Save className="w-3 h-3" /> Save Changes</button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-800 text-white text-xs font-black py-2 rounded-lg flex items-center justify-center gap-2"><X className="w-3 h-3" /> Abort</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="text-white font-bold leading-tight group-hover:text-neon-blue transition-colors line-clamp-1">{product.productName}</div>
                                        <div className="text-neon-blue font-black font-mono tracking-tighter text-lg">₹{Number(product.price).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-white/5">{product.category}</span>
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-white/5">{product.brand}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                                        <span className="text-slate-500 uppercase tracking-widest font-black">Stock Status</span>
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
