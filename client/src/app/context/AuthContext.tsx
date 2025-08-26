"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logoutUser } from '../api/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    role: string;
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
        setUser(userData);
        // Store user data in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(userData));
        // Note: Server sets HTTP-only cookie, so we don't need to set it here
    };

    const logout = async () => {
        try {
            console.log('Logging out...');
            await logoutUser();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state regardless of server response
            setUser(null);
            // Clear localStorage
            localStorage.removeItem('user');
            console.log('Local state cleared');

            // Force redirect to login page
            router.push('/login');
        }
    };

    const checkAuth = async () => {
        try {
            console.log('Checking authentication...');
            // Try to get current user from server
            const response = await getCurrentUser();
            if (response.status === 200 && response.data) {
                console.log('User authenticated:', response.data);
                setUser(response.data);
                // Store user data in localStorage for client-side access
                localStorage.setItem('user', JSON.stringify(response.data));
            } else {
                console.log('User not authenticated, status:', response.status);
                // User not authenticated
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
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
