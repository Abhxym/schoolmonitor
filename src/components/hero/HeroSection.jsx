"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-pattern"></div>
            <div className="container hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="badge">
                        <ShieldCheck size={16} className="text-gold" />
                        <span>Academic Excellence & Security</span>
                    </div>

                    <h1 className="hero-title">
                        Empower Your Institution with <br />
                        <span className="text-gold title-highlight">Elite Monitoring</span>
                    </h1>

                    <p className="hero-subtitle">
                        A prestige-tier management system designed for modern academies.
                        Track performance, ensure security, and foster leadership through our comprehensive platform.
                    </p>

                    <div className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/login" className="btn btn-primary hero-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Admin Login <ChevronRight size={20} />
                        </Link>
                        <Link href="/register" className="btn btn-outline hero-btn-outline">
                            Create Account
                        </Link>
                    </div>

                    <div className="stats-row">
                        <div className="stat-item">
                            <h3 className="stat-number">12</h3>
                            <p className="stat-label">Schools Connected</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">4,000+</h3>
                            <p className="stat-label">Students Tracked</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">Real-time</h3>
                            <p className="stat-label">Data Sync</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="dashboard-mockup">
                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mockup-title">SCMS Dashboard</div>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-sidebar"></div>
                            <div className="mockup-content">
                                <div className="mockup-card top-card"></div>
                                <div className="mockup-row">
                                    <div className="mockup-card half"></div>
                                    <div className="mockup-card half"></div>
                                </div>
                                <div className="mockup-card bottom"></div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="floating-element alert-card"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                        <ShieldCheck className="alert-icon text-gold" size={24} />
                        <div className="alert-text">
                            <h4>Perimeter Secured</h4>
                            <p>All sectors operating normally.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
