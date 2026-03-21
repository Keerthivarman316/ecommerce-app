'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: any;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
    checkAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('lootbay_token');
        const savedUser = localStorage.getItem('lootbay_user');

        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            if (savedUser) setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, userData: any) => {
        localStorage.setItem('lootbay_token', newToken);
        localStorage.setItem('lootbay_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        // Clear state first
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);

        // Clear storage
        localStorage.removeItem('lootbay_token');
        localStorage.removeItem('lootbay_user');

        // Single point of redirection
        router.replace('/auth');
    };

    const checkAuth = () => {
        const hasToken = !!localStorage.getItem('lootbay_token');
        if (!isLoggedIn && !hasToken) {
            router.replace('/auth');
            return false;
        }
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, loading, login, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
