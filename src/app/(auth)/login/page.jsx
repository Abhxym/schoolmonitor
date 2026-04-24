"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, CheckCircle, BarChart3, FileText, Eye, EyeOff, Users, School } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useAuth } from '../../../hooks/useAuth';
import './Login.css';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginRole, setLoginRole] = useState('mukhyadhyapak');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const isAdmin = loginRole === 'kendrapramuk';

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            await signIn('google', { callbackUrl: '/headmaster-dashboard' });
        } catch {
            toast.error('Google sign-in failed.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* ── Left Branding Panel ── */}
            <motion.div
                className="auth-brand"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <div className="auth-brand-inner">
                    <div className="brand-badge">
                        <Shield size={14} /> Secure Portal
                    </div>
                    <h1 className="brand-title">
                        {isAdmin ? (
                            <>Kendrapramuk<br /><span>Admin Portal</span></>
                        ) : (
                            <>Cluster School<br /><span>Monitoring System</span></>
                        )}
                    </h1>
                    <p className="brand-subtitle">
                        {isAdmin
                            ? 'Administrative access for the Kendrapramuk. Monitor all 12 cluster schools, review reports, manage GR documents, and oversee headmaster activities from a centralized dashboard.'
                            : 'Centralized platform for Zilla Parishad school management across Chhatrapati Sambhajinagar district. Track attendance, manage events, and streamline administrative workflows.'
                        }
                    </p>
                    <div className="brand-features">
                        {isAdmin ? (
                            <>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                    <div className="brand-feature-icon"><BarChart3 size={18} /></div>
                                    Oversee all 12 schools from a single dashboard
                                </motion.div>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                                    <div className="brand-feature-icon"><FileText size={18} /></div>
                                    Review & flag headmaster form submissions
                                </motion.div>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                    <div className="brand-feature-icon"><Users size={18} /></div>
                                    Manage users, access codes, and roles
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                    <div className="brand-feature-icon"><CheckCircle size={18} /></div>
                                    Real-time attendance monitoring across 12 schools
                                </motion.div>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                                    <div className="brand-feature-icon"><BarChart3 size={18} /></div>
                                    Analytics dashboards with performance insights
                                </motion.div>
                                <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                    <div className="brand-feature-icon"><FileText size={18} /></div>
                                    GR document management with cloud storage
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Right Form Panel ── */}
            <motion.div
                className="auth-form-panel"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            >
                <div className="auth-form-container">
                    <div className="auth-logo-mark">
                        {isAdmin
                            ? <Shield size={28} color="#e53e3e" />
                            : <School size={28} color="#d4af37" />
                        }
                    </div>
                    <h2 className="auth-form-title">{isAdmin ? 'Admin Login' : 'Welcome back'}</h2>
                    <p className="auth-form-subtitle">
                        {isAdmin
                            ? 'Sign in with your Kendrapramuk credentials.'
                            : 'Sign in to your SCMS account to continue.'
                        }
                    </p>

                    {/* ── Role Tabs ── */}
                    <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => { setLoginRole('mukhyadhyapak'); setFormData({ email: '', password: '' }); }}
                            style={{
                                flex: 1, padding: '0.65rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                backgroundColor: !isAdmin ? 'var(--accent-navy)' : '#f7fafc',
                                color: !isAdmin ? 'white' : '#718096',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                            }}
                        >
                            <School size={15} /> Mukhyadhyapak
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginRole('kendrapramuk'); setFormData({ email: '', password: '' }); }}
                            style={{
                                flex: 1, padding: '0.65rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                backgroundColor: isAdmin ? '#c53030' : '#f7fafc',
                                color: isAdmin ? 'white' : '#718096',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                borderLeft: '1px solid #e2e8f0',
                            }}
                        >
                            <Shield size={15} /> Kendrapramuk
                        </button>
                    </div>

                    {/* Google Sign-in (only for Mukhyadhyapak) */}
                    {!isAdmin && (
                        <>
                            <button id="google-signin-btn" onClick={handleGoogle} disabled={googleLoading} className="google-btn">
                                {googleLoading ? <Loader2 className="spinner" size={18} /> : <GoogleIcon />}
                                Continue with Google
                            </button>

                            <div className="auth-divider">
                                <div className="auth-divider-line" />
                                <span className="auth-divider-text">or sign in with email</span>
                                <div className="auth-divider-line" />
                            </div>
                        </>
                    )}

                    {/* Admin notice */}
                    {isAdmin && (
                        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#c53030' }}>
                            <Shield size={14} />
                            <span>Restricted access. Only authorized Kendrapramuk accounts can sign in.</span>
                        </div>
                    )}

                    {/* Email/Password Form */}
                    <form onSubmit={handleLogin}>
                        <div className="auth-fields">
                            <div className="field-group">
                                <label htmlFor="login-email" className="field-label">Email Address</label>
                                <div className="field-wrapper">
                                    <input
                                        id="login-email"
                                        type="email"
                                        className="field-input"
                                        placeholder={isAdmin ? 'kendrapramuk@zp.edu' : 'you@gmail.com'}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        autoComplete="email"
                                    />
                                    <Mail className="field-icon" size={16} />
                                </div>
                            </div>

                            <div className="field-group">
                                <div className="field-label-row">
                                    <label htmlFor="login-password" className="field-label">Password</label>
                                    <Link href="/forgot-password" className="forgot-link">Forgot?</Link>
                                </div>
                                <div className="field-wrapper">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="field-input"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        autoComplete="current-password"
                                    />
                                    <Lock className="field-icon" size={16} />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="remember-row">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="remember-checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="remember-label">Remember me</label>
                            </div>

                            <button
                                id="login-submit-btn"
                                type="submit"
                                className="auth-submit"
                                disabled={isLoading}
                                style={isAdmin ? { backgroundColor: '#c53030' } : {}}
                            >
                                {isLoading ? <Loader2 className="spinner" size={18} /> : (isAdmin ? 'Sign In as Kendrapramuk' : 'Sign In')}
                            </button>
                        </div>
                    </form>

                    {/* Footer — only show registration link for Mukhyadhyapak */}
                    <div className="auth-form-footer">
                        {isAdmin ? (
                            <p style={{ color: '#a0aec0', fontSize: '0.85rem' }}>
                                Kendrapramuk accounts are pre-provisioned. Contact the system administrator if you need access.
                            </p>
                        ) : (
                            <p>Don&apos;t have an account? <Link href="/register">Create one</Link></p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
