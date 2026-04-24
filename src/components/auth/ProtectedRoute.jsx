'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace('/'); return; }
        if (allowedRole && user.role !== allowedRole) {
            router.replace(user.role === 'kendrapramuk' ? '/admin-dashboard' : '/headmaster-dashboard');
        }
    }, [user, loading, allowedRole, router]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfaf0' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--accent-navy)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#718096', fontSize: '0.9rem' }}>Authenticating...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!user || (allowedRole && user.role !== allowedRole)) return null;
    return children;
}
