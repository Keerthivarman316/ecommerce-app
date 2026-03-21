'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type StoreContextType = {
    cart: any[];
    addToCart: (item: any, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    wishlist: any[];
    toggleWishlist: (item: any) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('lootbay_cart');
        const savedWishlist = localStorage.getItem('lootbay_wishlist');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }, []);

    useEffect(() => {
        localStorage.setItem('lootbay_cart', JSON.stringify(cart));
        localStorage.setItem('lootbay_wishlist', JSON.stringify(wishlist));
    }, [cart, wishlist]);

    const addToCart = (item: any, quantity: number = 1) => {
        setCart((prev) => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...item, quantity }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (item: any) => {
        setWishlist((prev) => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) return prev.filter(i => i.id !== item.id);
            return [...prev, item];
        });
    };

    return (
        <StoreContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, wishlist, toggleWishlist }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within a StoreProvider");
    return context;
};
