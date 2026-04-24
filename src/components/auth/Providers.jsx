'use client';
import { AuthProvider } from '../../context/AuthContext';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
    );
}
