"use client";
import React, { useState } from 'react';
import { DownloadCloud, LogOut, Shield, LayoutDashboard, FileText, Users, ClipboardList, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ role = 'kendrapramuk', onLogout, schoolName }) => {
    const pathname = usePathname();
    const [confirmLogout, setConfirmLogout] = useState(false);
    const isAdmin = role === 'kendrapramuk';
    const roleTitle = isAdmin ? 'KENDRAPRAMUK' : 'MUKHYADHYAPAK';

    const adminLinks = [
        { href: '/admin-dashboard',  icon: <LayoutDashboard size={20} />, label: 'Dashboard Overview' },
        { href: '/admin-attendance', icon: <ClipboardList size={20} />,   label: 'Attendance Reports' },
        { href: '/gr-management',    icon: <FileText size={20} />,        label: 'Forms & GR Upload' },
        { href: '/form-responses',   icon: <ClipboardList size={20} />,   label: 'Form Responses' },
        { href: '/event-approvals',  icon: <Calendar size={20} />,        label: 'Event Approvals' },
        { href: '/user-management',  icon: <Users size={20} />,            label: 'User Management' },
    ];

    const headLinks = [
        { href: '/headmaster-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { href: '/data-submissions',     icon: <ClipboardList size={20} />,   label: 'Data Submissions' },
        { href: '/gr-viewer',            icon: <FileText size={20} />,        label: 'Official Notices (GR)' },
        { href: '/submit-reports',       icon: <ClipboardList size={20} />,   label: 'Submit Reports' },
        { href: '/reports',              icon: <DownloadCloud size={20} />,   label: 'System Resources' },
    ];

    const links = isAdmin ? adminLinks : headLinks;

    return (
        <aside style={{ width: '260px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #edf2f7' }}>
                <div className="logo" style={{ color: 'var(--accent-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield className="text-gold" size={28} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SC<span className="text-gold">MS</span></span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#718096', letterSpacing: '1px' }}>{roleTitle} PORTAL</div>
                {!isAdmin && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#f0f4f8', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#2d3748' }}>
                        {schoolName || 'My School'}
                    </div>
                )}
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {links.map(({ href, icon, label }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '0.75rem 1rem', borderRadius: '6px', fontWeight: 500,
                            textDecoration: 'none', transition: 'all 0.15s',
                            backgroundColor: active ? 'var(--accent-navy)' : 'transparent',
                            color: active ? 'white' : '#4a5568',
                        }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = '#f0f4f8'; e.currentTarget.style.color = 'var(--accent-navy)'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4a5568'; } }}
                        >
                            {icon} {label}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid #edf2f7' }}>
                {confirmLogout ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: 0 }}>Sign out?</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => onLogout()} style={{ flex: 1, padding: '0.4rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Yes</button>
                            <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: '0.4rem', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setConfirmLogout(true)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: '0.5rem', fontWeight: 500 }}>
                        <LogOut size={20} /> Sign Out
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
