import React from 'react';
import { Shield, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-navy" id="contact">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <a href="#" className="logo footer-logo">
                            <Shield className="logo-icon text-gold" size={32} />
                            <span className="logo-text text-white">SC<span className="text-gold">MS</span></span>
                        </a>
                        <p className="footer-desc">
                            Cluster School Monitoring System — Chhatrapati Sambhajinagar, Maharashtra. Empowering 12 schools with real-time data and transparent governance.
                        </p>
                        <div className="security-badge">
                            <ShieldCheck size={18} className="text-gold" />
                            <span>Enterprise Grade Security</span>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-title">Platform</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Surveillance Hub</a></li>
                            <li><a href="#modules">Attendance Protocol</a></li>
                            <li><a href="#">System Analytics</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-title">Institution</h4>
                        <ul className="footer-links">
                            <li><a href="/login">Administrator Portal</a></li>
                            <li><a href="/register">Create Account</a></li>
                            <li><a href="/schools">School Directory</a></li>
                            <li><a href="/contact">Support Center</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4 className="footer-title">Contact</h4>
                        <ul className="contact-list">
                            <li><Mail size={16} className="text-gold" /> kendrapramuk@zp.edu</li>
                            <li><Phone size={16} className="text-gold" /> +91 800-123-4567</li>
                            <li><MapPin size={16} className="text-gold" /> Zilla Parishad Bhavan, Chhatrapati Sambhajinagar, Maharashtra 431001</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Zilla Parishad Chhatrapati Sambhajinagar — SCMS. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Preferences <ExternalLink size={12} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
