"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowLeft, Shield, Eye, EyeOff, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAuth } from '../../hooks/useAuth';
import './AuthModal.css';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

function getPasswordStrength(password) {
    if (!password) return { level: 0, label: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { level: 1, label: 'Weak' };
    if (score <= 3) return { level: 2, label: 'Medium' };
    return { level: 3, label: 'Strong' };
}

export default function AuthModal() {
    const { login, register } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const strengthClass = strength.level === 1 ? 'weak' : strength.level === 2 ? 'medium' : strength.level === 3 ? 'strong' : '';

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setView('login');
            setEmail('');
            setPassword('');
            setName('');
            setConfirmPassword('');
            setShowPassword(false);
        };
        window.addEventListener('openAuthModal', handleOpen);
        return () => window.removeEventListener('openAuthModal', handleOpen);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleClose = () => setIsOpen(false);

    const switchView = (v) => {
        setView(v);
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please enter both email and password.'); return; }
        setIsLoading(true);
        try {
            await login(email, password);
            handleClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) { toast.error('Please fill all fields.'); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
        if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }
        setIsLoading(true);
        try {
            await register(name, email, password);
            handleClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        if (!email) { toast.error('Please enter your registered email.'); return; }
        setIsLoading(true);
        try {
            const { default: api } = await import('../../services/axios');
            await api.post('/auth/forgot-password', { email });
            toast.success('If that email exists, a reset link has been sent.');
            switchView('login');
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        await signIn('google', { callbackUrl: '/headmaster-dashboard' });
    };

    if (!isOpen) return null;

    const getTitle = () => {
        if (view === 'login') return 'Welcome back!';
        if (view === 'register') return 'Create account';
        return 'Recovery Check';
    };

    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={handleClose}></div>
            <motion.div
                className="auth-modal"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
            >
                <button className="modal-close" onClick={handleClose}><X size={20} className="close-icon" /></button>

                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Shield className="text-gold" size={48} />
                    </div>
                    <h2>{getTitle()}</h2>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'login' ? (
                        <motion.form key="login" className="auth-form" onSubmit={handleLogin}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="input-wrapper">
                                    <input type="email" placeholder="you@gmail.com" value={email}
                                        onChange={e => setEmail(e.target.value)} className="classic-input" autoComplete="email" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>PASSWORD</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                                        onChange={e => setPassword(e.target.value)} className="classic-input"
                                        style={{ paddingRight: '2.5rem' }} autoComplete="current-password" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', padding: '2px' }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-options">
                                <span />
                                <button type="button" className="text-btn forgot-link" onClick={() => switchView('forgot')}>
                                    Forgot password?
                                </button>
                            </div>
                            <button type="submit" className="modal-submit-btn" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spinner" size={20} /> : 'Login'}
                            </button>

                            <div className="auth-footer" style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
                                Don&apos;t have an account?{' '}
                                <button type="button" onClick={() => switchView('register')} style={{ color: 'var(--accent-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Register</button>
                                {' · '}
                                <Link href="/login" onClick={handleClose} style={{ color: 'var(--accent-navy)', fontWeight: 600 }}>Full Login Page</Link>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                                <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                            </div>

                            <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading} className="google-btn">
                                {googleLoading ? <Loader2 className="spinner" size={18} /> : <GoogleIcon />}
                                Continue with Google
                            </button>
                        </motion.form>

                    ) : view === 'register' ? (
                        <motion.form key="register" className="auth-form" onSubmit={handleRegister}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <div className="form-group">
                                <label>FULL NAME</label>
                                <div className="input-wrapper">
                                    <input type="text" placeholder="Your full name" value={name}
                                        onChange={e => setName(e.target.value)} className="classic-input" autoComplete="name" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="input-wrapper">
                                    <input type="email" placeholder="you@gmail.com" value={email}
                                        onChange={e => setEmail(e.target.value)} className="classic-input" autoComplete="email" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>PASSWORD</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                                        onChange={e => setPassword(e.target.value)} className="classic-input"
                                        style={{ paddingRight: '2.5rem' }} autoComplete="new-password" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', padding: '2px' }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                                        <div style={{ display: 'flex', gap: '4px', height: '3px' }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{
                                                    flex: 1, borderRadius: '999px',
                                                    background: strength.level >= i
                                                        ? (strengthClass === 'weak' ? '#e53e3e' : strengthClass === 'medium' ? '#dd6b20' : '#38a169')
                                                        : '#e2e8f0',
                                                    transition: 'background 0.3s'
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 500, color: strengthClass === 'weak' ? '#e53e3e' : strengthClass === 'medium' ? '#dd6b20' : '#38a169' }}>
                                            {strength.label} password
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>CONFIRM PASSWORD</label>
                                <div className="input-wrapper">
                                    <input type="password" placeholder="Repeat password" value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)} className="classic-input" autoComplete="new-password"
                                        style={{ borderColor: confirmPassword.length > 0 ? (password === confirmPassword ? '#38a169' : '#e53e3e') : undefined }} />
                                </div>
                                {confirmPassword.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.15rem', color: password === confirmPassword ? '#38a169' : '#e53e3e' }}>
                                        {password === confirmPassword ? <><Check size={12} /> Match</> : <><X size={12} /> Mismatch</>}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="modal-submit-btn" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spinner" size={20} /> : 'Create Account'}
                            </button>
                            <div className="auth-footer" style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
                                Already have an account?{' '}
                                <button type="button" onClick={() => switchView('login')} style={{ color: 'var(--accent-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Sign in</button>
                            </div>
                        </motion.form>

                    ) : (
                        <motion.form key="forgot" className="auth-form" onSubmit={handleForgot}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="input-wrapper">
                                    <input type="email" placeholder="you@gmail.com" value={email}
                                        onChange={e => setEmail(e.target.value)} className="classic-input" autoComplete="email" />
                                </div>
                            </div>
                            <button type="submit" className="modal-submit-btn" disabled={isLoading} style={{ marginTop: '1rem' }}>
                                {isLoading ? <Loader2 className="spinner" size={20} /> : 'Send Reset Link'}
                            </button>
                            <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="text-btn back-btn" onClick={() => switchView('login')} style={{ color: 'var(--text-dark)', margin: '0 auto' }}>
                                    <ArrowLeft size={16} /> Back to Login
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
