"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import '../login/Login.css';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your registered email.');
            return;
        }
        setIsLoading(true);
        try {
            const { default: api } = await import('../../../services/axios');
            await api.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
            toast.success('Reset link sent!');
        } catch {
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
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
                        <KeyRound size={14} /> Account Recovery
                    </div>
                    <h1 className="brand-title">
                        Reset Your<br />
                        <span>Password</span>
                    </h1>
                    <p className="brand-subtitle">
                        Don&apos;t worry — it happens to everyone. Enter the email address
                        associated with your SCMS account and we&apos;ll send you a secure
                        link to reset your password.
                    </p>
                    <div className="brand-features">
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="brand-feature-icon"><Mail size={18} /></div>
                            Check your inbox for the reset link
                        </motion.div>
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                            <div className="brand-feature-icon"><Shield size={18} /></div>
                            Link expires in 1 hour for security
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

                    {!isSubmitted ? (
                        <>
                            <h2 className="auth-form-title">Forgot password?</h2>
                            <p className="auth-form-subtitle">
                                Enter your email and we&apos;ll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleReset}>
                                <div className="auth-fields">
                                    <div className="field-group">
                                        <label htmlFor="forgot-email" className="field-label">Email Address</label>
                                        <div className="field-wrapper">
                                            <input
                                                id="forgot-email"
                                                type="email"
                                                className="field-input"
                                                placeholder="you@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                            />
                                            <Mail className="field-icon" size={16} />
                                        </div>
                                    </div>

                                    <button id="forgot-submit-btn" type="submit" className="auth-submit" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="spinner" size={18} /> : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div className="success-icon-wrap">
                                <CheckCircle2 size={36} color="#38a169" />
                            </div>
                            <h2 className="auth-form-title">Check your inbox</h2>
                            <p className="auth-form-subtitle" style={{ marginBottom: '1.5rem' }}>
                                If an account exists for <strong style={{ color: '#1a202c' }}>{email}</strong>, we&apos;ve sent a password reset link.
                            </p>
                            <button
                                className="google-btn"
                                onClick={() => setIsSubmitted(false)}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                Try another email
                            </button>
                        </motion.div>
                    )}

                    <div className="auth-form-footer">
                        <p>
                            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <ArrowLeft size={14} /> Back to sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
