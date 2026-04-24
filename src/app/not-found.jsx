'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', maxWidth: '480px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Shield size={48} color="var(--accent-gold)" />
                </div>
                <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--accent-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-navy)', marginBottom: '1rem' }}>Page Not Found</h2>
                <p style={{ color: '#718096', marginBottom: '2rem', lineHeight: 1.6 }}>
                    The page you are looking for does not exist or you do not have permission to access it.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Go Home
                    </Link>
                    <Link href="/login" className="btn btn-outline">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
