"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logoutUser } from '../api/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    role: string;
    name: string
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User, token: string) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const login = (userData: User, token: string) => {
        setUser({ ...userData, name: userData.name });
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();
            if (response.status === 200 && response.data && response.data.data) {
                setUser({ ...response.data.data, name: response.data.data.name });
                localStorage.setItem('user', JSON.stringify(response.data.data));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // First try to get user from localStorage for immediate UI update
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser({ ...userData, name: userData.name });
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
            }
        }

        // Then verify with server
        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
