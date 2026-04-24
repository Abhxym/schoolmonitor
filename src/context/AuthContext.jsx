'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { login as loginService, logout as logoutService, getStoredUser, getMe } from '../services/auth.service';
import api from '../services/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

function isTokenExpired() {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch { return true; }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    const logout = useCallback((silent = false) => {
        logoutService();
        setUser(null);
        if (!silent) router.push('/');
    }, [router]);

    useEffect(() => {
        if (status === 'loading') return;
        if (session?.zpToken && session?.zpUser) {
            const u = session.zpUser;
            localStorage.setItem('token', session.zpToken);
            localStorage.setItem('user', JSON.stringify(u));
            setUser(u);
            setLoading(false);
            return;
        }
        const stored = getStoredUser();
        if (stored && !isTokenExpired()) {
            setUser(stored);
            getMe().then(fresh => {
                setUser(fresh);
                localStorage.setItem('user', JSON.stringify(fresh));
            }).catch(() => {});
        } else if (stored) {
            logout(true);
        }
        setLoading(false);
    }, [session, status, logout]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (getStoredUser() && isTokenExpired()) {
                toast.error('Session expired. Please log in again.');
                logout(false);
            }
        }, 60_000);
        return () => clearInterval(interval);
    }, [logout]);

    const login = async (email, password) => {
        const u = await loginService(email, password);
        setUser(u);
        toast.success(`Welcome, ${u.name}!`);
        if (u.role === 'kendrapramuk') router.push('/admin-dashboard');
        else router.push('/headmaster-dashboard');
        return u;
    };

    const register = async (name, email, password, schoolId, accessCode) => {
        const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
        const res = await fetch(`${backendUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, schoolId, accessCode }),
        });
        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Registration failed.');
            error.response = { data };
            throw error;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Welcome, ${data.user.name}!`);
        router.push('/headmaster-dashboard');
        return data.user;
    };

    const handleGoogleSuccess = useCallback((zpUser) => {
        if (!zpUser) return;
        toast.success(`Welcome, ${zpUser.name}!`);
        if (zpUser.role === 'kendrapramuk') router.push('/admin-dashboard');
        else router.push('/headmaster-dashboard');
    }, [router]);

    const googleRedirected = useRef(false);
    useEffect(() => {
        if (session?.zpUser && user?.id === session.zpUser.id && !googleRedirected.current) {
            googleRedirected.current = true;
            handleGoogleSuccess(session.zpUser);
        }
    }, [session, user, handleGoogleSuccess]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout: () => logout(false), loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
