"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Loader2, Users, ClipboardList, Calendar, Eye, EyeOff, Check, X, School, KeyRound } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useAuth } from '../../../hooks/useAuth';
import '../login/Login.css';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

export default function RegisterPage() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', schoolId: '', accessCode: '' });

    const schools = [
        { id: 1, name: 'ZP School Paithan' },
        { id: 2, name: 'ZP School Kannad' },
        { id: 3, name: 'ZP School Khuldabad' },
        { id: 4, name: 'ZP School Sillod' },
        { id: 5, name: 'ZP School Vaijapur' },
        { id: 6, name: 'ZP School Gangapur' },
        { id: 7, name: 'ZP School Waluj' },
        { id: 8, name: 'ZP School Phulambri' },
        { id: 9, name: 'ZP School Aurangabad City' },
        { id: 10, name: 'ZP School Soegaon' },
        { id: 11, name: 'ZP School Jalna Road' },
        { id: 12, name: 'ZP School Beed Bypass' },
    ];

    const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
    const strengthClass = strength.level === 1 ? 'weak' : strength.level === 2 ? 'medium' : strength.level === 3 ? 'strong' : '';
    const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
    const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all fields.');
            return;
        }
        if (!formData.schoolId) {
            toast.error('Please select your school.');
            return;
        }
        if (!formData.accessCode.trim()) {
            toast.error('Please enter the school access code.');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.schoolId, formData.accessCode.trim().toUpperCase());
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Registration failed.';
            toast.error(msg);
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
                        <Users size={14} /> Join the Network
                    </div>
                    <h1 className="brand-title">
                        Start Managing<br />
                        <span>Your School</span>
                    </h1>
                    <p className="brand-subtitle">
                        Create your account to access the SCMS platform. As a registered
                        Mukhyadhyapak, you&apos;ll be able to submit attendance, manage events,
                        and communicate with the Kendrapramuk directly.
                    </p>
                    <div className="brand-features">
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="brand-feature-icon"><ClipboardList size={18} /></div>
                            Submit daily attendance and monthly reports
                        </motion.div>
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                            <div className="brand-feature-icon"><Calendar size={18} /></div>
                            Register campus events for approval
                        </motion.div>
                        <motion.div className="brand-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                            <div className="brand-feature-icon"><Shield size={18} /></div>
                            Secure JWT-based authentication
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
                        <Shield size={28} color="#d4af37" />
                    </div>
                    <h2 className="auth-form-title">Create account</h2>
                    <p className="auth-form-subtitle">Register to access the school management portal.</p>

                    {/* Google Sign-up */}
                    <button id="google-signup-btn" onClick={handleGoogle} disabled={googleLoading} className="google-btn">
                        {googleLoading ? <Loader2 className="spinner" size={18} /> : <GoogleIcon />}
                        Sign up with Google
                    </button>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or register with email</span>
                        <div className="auth-divider-line" />
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister}>
                        <div className="auth-fields">
                            <div className="field-group">
                                <label htmlFor="reg-name" className="field-label">Full Name</label>
                                <div className="field-wrapper">
                                    <input
                                        id="reg-name"
                                        type="text"
                                        className="field-input"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        autoComplete="name"
                                    />
                                    <User className="field-icon" size={16} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label htmlFor="reg-school" className="field-label">Assign School</label>
                                <div className="field-wrapper">
                                    <select
                                        id="reg-school"
                                        className="field-input"
                                        value={formData.schoolId}
                                        onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                                        style={{ appearance: 'none', paddingRight: '2.5rem' }}
                                        required
                                    >
                                        <option value="">Select your school...</option>
                                        {schools.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <School className="field-icon" size={16} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label htmlFor="reg-access-code" className="field-label">School Access Code</label>
                                <div className="field-wrapper">
                                    <input
                                        id="reg-access-code"
                                        type="text"
                                        className="field-input"
                                        placeholder="Enter code provided by Kendrapramuk"
                                        value={formData.accessCode}
                                        onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                                        style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}
                                        autoComplete="off"
                                    />
                                    <KeyRound className="field-icon" size={16} />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.25rem', display: 'block' }}>Get this code from your Kendrapramuk</span>
                            </div>

                            <div className="field-group">
                                <label htmlFor="reg-email" className="field-label">Email Address</label>
                                <div className="field-wrapper">
                                    <input
                                        id="reg-email"
                                        type="email"
                                        className="field-input"
                                        placeholder="you@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        autoComplete="email"
                                    />
                                    <Mail className="field-icon" size={16} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label htmlFor="reg-password" className="field-label">Password</label>
                                <div className="field-wrapper">
                                    <input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="field-input"
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        autoComplete="new-password"
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
                                {formData.password.length > 0 && (
                                    <div className="password-strength">
                                        <div className="strength-bars">
                                            <div className={`strength-bar ${strength.level >= 1 ? `active ${strengthClass}` : ''}`} />
                                            <div className={`strength-bar ${strength.level >= 2 ? `active ${strengthClass}` : ''}`} />
                                            <div className={`strength-bar ${strength.level >= 3 ? `active ${strengthClass}` : ''}`} />
                                        </div>
                                        <span className={`strength-text ${strengthClass}`}>{strength.label} password</span>
                                    </div>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="reg-confirm" className="field-label">Confirm Password</label>
                                <div className="field-wrapper">
                                    <input
                                        id="reg-confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        className={`field-input ${passwordsMatch ? 'field-success' : ''} ${passwordsMismatch ? 'field-error' : ''}`}
                                        placeholder="Repeat your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        autoComplete="new-password"
                                    />
                                    <Lock className="field-icon" size={16} />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        tabIndex={-1}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {formData.confirmPassword.length > 0 && (
                                    <div className={`match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                        {passwordsMatch ? <><Check size={12} /> Passwords match</> : <><X size={12} /> Passwords don&apos;t match</>}
                                    </div>
                                )}
                            </div>

                            <button id="register-submit-btn" type="submit" className="auth-submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spinner" size={18} /> : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-form-footer">
                        <p>Already have an account? <Link href="/login">Sign in</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
