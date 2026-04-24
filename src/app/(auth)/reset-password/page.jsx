"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Loader2, CheckCircle2, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../../services/axios';
import '../login/Login.css';

function ResetForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
        if (password !== confirm) { toast.error('Passwords do not match.'); return; }
        if (!token) { toast.error('Invalid reset link.'); return; }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setDone(true);
            toast.success('Password updated! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
        } finally {
            setLoading(false);
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
                        <KeyRound size={14} /> Password Reset
                    </div>
                    <h1 className="brand-title">
                        Set Your New<br />
                        <span>Password</span>
                    </h1>
                    <p className="brand-subtitle">
                        Choose a strong password to secure your SCMS account.
                        Make sure it&apos;s at least 6 characters and something you&apos;ll remember.
                    </p>
                    <div className="brand-features">
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="brand-feature-icon"><Lock size={18} /></div>
                            Minimum 6 characters required
                        </motion.div>
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                            <div className="brand-feature-icon"><Shield size={18} /></div>
                            Passwords are encrypted with bcrypt
                        </motion.div>
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
                        <KeyRound size={28} color="#d4af37" />
                    </div>

                    {done ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                            <div className="success-icon-wrap">
                                <CheckCircle2 size={36} color="#38a169" />
                            </div>
                            <h2 className="auth-form-title">Password Updated</h2>
                            <p className="auth-form-subtitle" style={{ marginBottom: '1.5rem' }}>
                                Your password has been changed successfully. You can now log in with your new password.
                            </p>
                            <Link href="/login" className="auth-submit" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                                Go to Login
                            </Link>
                        </motion.div>
                    ) : !token ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                            <div className="error-icon-wrap">
                                <AlertTriangle size={36} color="#e53e3e" />
                            </div>
                            <h2 className="auth-form-title">Invalid Link</h2>
                            <p className="auth-form-subtitle" style={{ marginBottom: '1.5rem' }}>
                                This reset link is invalid or has expired. Please request a new one.
                            </p>
                            <Link href="/forgot-password" className="google-btn" style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}>
                                Request New Link
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="auth-form-title">Set new password</h2>
                            <p className="auth-form-subtitle">Enter a new password for your account.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="auth-fields">
                                    <div className="field-group">
                                        <label htmlFor="reset-password" className="field-label">New Password</label>
                                        <div className="field-wrapper">
                                            <input
                                                id="reset-password"
                                                type={showPassword ? 'text' : 'password'}
                                                className="field-input"
                                                placeholder="Min. 6 characters"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <Lock className="field-icon" size={16} />
                                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="field-group">
                                        <label htmlFor="reset-confirm" className="field-label">Confirm Password</label>
                                        <div className="field-wrapper">
                                            <input
                                                id="reset-confirm"
                                                type={showConfirm ? 'text' : 'password'}
                                                className={`field-input ${confirm.length > 0 && password === confirm ? 'field-success' : ''} ${confirm.length > 0 && password !== confirm ? 'field-error' : ''}`}
                                                placeholder="Repeat password"
                                                value={confirm}
                                                onChange={e => setConfirm(e.target.value)}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <Lock className="field-icon" size={16} />
                                            <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button id="reset-submit-btn" type="submit" className="auth-submit" disabled={loading}>
                                        {loading ? <Loader2 className="spinner" size={18} /> : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    <div className="auth-form-footer">
                        <p><Link href="/login">← Back to sign in</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1628' }}><Loader2 size={32} className="spinner" style={{ color: '#d4af37' }} /></div>}>
            <ResetForm />
        </Suspense>
    );
}
