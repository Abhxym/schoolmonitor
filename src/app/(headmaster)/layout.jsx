'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function HeadmasterLayoutInner({ children }) {
    const { user, logout } = useAuth();
    const [schoolName, setSchoolName] = React.useState('');
    const [showProfile, setShowProfile] = useState(false);

    React.useEffect(() => {
        if (user?.schoolId) {
            import('../../services/axios').then(({ default: api }) => {
                api.get(`/schools/${user.schoolId}`)
                    .then(r => setSchoolName(r.data.name.replace('Zilla Parishad School ', 'ZP School ')))
                    .catch(() => {});
            });
        }
    }, [user?.schoolId]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
            <Sidebar role="mukhyadhyapak" onLogout={logout} schoolName={schoolName} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header style={{ backgroundColor: 'white', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
                    {/* Profile dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowProfile(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-navy)' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#718096' }}>Mukhyadhyapak</div>
                            </div>
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'M')}&background=002147&color=fff`}
                                alt="Avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </button>
                        {showProfile && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', width: '240px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--accent-navy)', fontSize: '0.95rem' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.15rem' }}>{user?.email}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#a0aec0', marginTop: '0.25rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Mukhyadhyapak</div>
                                    {schoolName && <div style={{ fontSize: '0.75rem', color: 'var(--accent-navy)', marginTop: '0.35rem', fontWeight: 500 }}>{schoolName}</div>}
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
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>{children}</div>
            </main>
        </div>
    );
}

export default function HeadmasterLayout({ children }) {
    return (
        <ProtectedRoute allowedRole="mukhyadhyapak">
            <HeadmasterLayoutInner>{children}</HeadmasterLayoutInner>
        </ProtectedRoute>
    );
}
