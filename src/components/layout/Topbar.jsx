"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Topbar.css';

const Topbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Set date only on client to avoid hydration mismatch
    setCurrentDate(new Intl.DateTimeFormat('en-GB').format(new Date()));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Shield className="logo-icon" size={32} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-text">SCMS</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--accent-navy)', opacity: 0.8, marginTop: '-2px', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-sans)' }}>Cluster School Monitoring System</span>
          </div>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/schools" className="nav-link">Schools</Link>
          <Link href="/attendance" className="nav-link">Attendance</Link>
          <Link href="/events" className="nav-link">Events</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </div>

        <div className="nav-actions desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="system-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem', color: 'var(--accent-navy)', fontFamily: 'var(--font-sans)' }}>
            <span style={{ opacity: 0.7, marginBottom: '4px' }}>Updated: {currentDate}</span>
            <div id="google_translate_element" style={{ minWidth: '120px' }}></div>
          </div>
          <Link href="/login" className="btn btn-primary nav-btn" style={{ border: 'none', cursor: 'pointer' }}>Login</Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/schools" onClick={() => setMobileMenuOpen(false)}>Schools</Link>
            <Link href="/attendance" onClick={() => setMobileMenuOpen(false)}>Attendance</Link>
            <Link href="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div id="google_translate_element_mobile"></div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary nav-btn"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', border: 'none' }}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Topbar;
