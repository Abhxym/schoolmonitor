'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { Bell, X, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

function AdminLayoutInner({ children }) {
    const { user, logout } = useAuth();
    const { data: notifications, unreadCount, markRead } = useNotifications();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'KP';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fcfaf0' }}>
            <Sidebar role="kendrapramuk" onLogout={logout} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header style={{ backgroundColor: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10, position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowNotifs(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem' }}>
                            <Bell size={24} color="#4a5568" />
                            {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', backgroundColor: '#e53e3e', borderRadius: '50%', border: '2px solid white', fontSize: '0.65rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifs && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', width: '320px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 100 }}>
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>Notifications</span>
                                    <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.length === 0 && <p style={{ padding: '1rem', color: '#a0aec0', fontSize: '0.9rem' }}>No notifications.</p>}
                                    {notifications.map(n => (
                                        <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f7fafc', cursor: 'pointer', backgroundColor: n.read ? 'white' : '#fffbeb', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.read ? '#cbd5e0' : '#e53e3e', marginTop: '5px', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#2d3748' }}>{n.message}</p>
                                                <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Profile dropdown */}
                    <div style={{ marginLeft: '1.5rem', position: 'relative' }}>
                        <button onClick={() => { setShowProfile(p => !p); setShowNotifs(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#718096' }}>Kendrapramuk</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-navy)', fontWeight: 700 }}>
                                {initials}
                            </div>
                        </button>
                        {showProfile && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', width: '240px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--accent-navy)', fontSize: '0.95rem' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.15rem' }}>{user?.email}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#a0aec0', marginTop: '0.25rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Kendrapramuk</div>
                                </div>
                                <button onClick={() => { setShowProfile(false); logout(); }} style={{ width: '100%', padding: '0.875rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#e53e3e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff5f5'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>{children}</div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute allowedRole="kendrapramuk">
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </ProtectedRoute>
    );
}
