"use client";
import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import { Loader2, Shield, User, AlertCircle, KeyRound, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [schoolsWithCodes, setSchoolsWithCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/users').then(r => setUsers(r.data)),
            api.get('/schools').then(r => setSchools(r.data)),
            api.get('/schools/admin/access-codes').then(r => setSchoolsWithCodes(r.data)).catch(() => {}),
        ]).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const copyCode = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleRoleChange = async (id, role) => {
        try {
            const { data } = await api.patch(`/users/${id}/role`, { role });
            setUsers(prev => prev.map(u => u.id === id ? data : u));
            toast.success('Role updated.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed.');
        }
    };

    const handleSchoolChange = async (id, schoolId) => {
        if (!schoolId) return;
        try {
            const { data } = await api.patch(`/users/${id}/school`, { schoolId: parseInt(schoolId) });
            setUsers(prev => prev.map(u => u.id === id ? data : u));
            toast.success('School assigned.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Assignment failed.');
        }
    };

    const kendraCount     = users.filter(u => u.role === 'kendrapramuk').length;
    const mukhaCount      = users.filter(u => u.role === 'mukhyadhyapak').length;
    const provisionedCount = users.filter(u => u.provisioned).length;

    const columns = [
        { header: 'ID',    key: 'id',    render: v => <span style={{ color: '#a0aec0', fontFamily: 'monospace' }}>#{v}</span> },
        {
            header: 'Name', key: 'name',
            render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {row.avatar
                        ? <img src={row.avatar} alt={v} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                        : <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                            {v?.charAt(0)}
                          </div>
                    }
                    <span style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>{v}</span>
                    {row.provisioned && (
                        <span title="Needs school assignment" style={{ color: '#d69e2e' }}>
                            <AlertCircle size={14} />
                        </span>
                    )}
                </div>
            )
        },
        { header: 'Email', key: 'email' },
        {
            header: 'School', key: 'schoolId',
            render: (v, row) => {
                if (row.role !== 'mukhyadhyapak') return <span style={{ color: '#a0aec0' }}>—</span>;
                return (
                    <select
                        value={v || ''}
                        onChange={e => handleSchoolChange(row.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', border: `1px solid ${!v ? '#e53e3e' : '#e2e8f0'}`, borderRadius: '4px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', maxWidth: '160px' }}
                    >
                        <option value="">— Assign school —</option>
                        {schools.map(s => (
                            <option key={s.id} value={s.id}>{s.name.replace('Zilla Parishad School ', '')}</option>
                        ))}
                    </select>
                );
            }
        },
        {
            header: 'Role', key: 'role',
            render: v => <Badge variant={v === 'kendrapramuk' ? 'success' : 'warning'}>{v}</Badge>
        },
        {
            header: 'Change Role', key: 'id',
            render: (id, row) => (
                <select
                    value={row.role}
                    onChange={e => handleRoleChange(id, e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="kendrapramuk">kendrapramuk</option>
                    <option value="mukhyadhyapak">mukhyadhyapak</option>
                </select>
            )
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>User Management</h1>
                <p style={{ color: '#718096' }}>View, assign schools, and manage roles for all portal users.</p>
            </div>

            {provisionedCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', backgroundColor: '#fffbeb', border: '1px solid #feebc8', borderRadius: '8px', marginBottom: '1.5rem', color: '#92400e' }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {provisionedCount} user{provisionedCount > 1 ? 's' : ''} signed in via Google and need{provisionedCount === 1 ? 's' : ''} a school assigned.
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Users',    count: users.length,    icon: <User size={24} color="#4a5568" />,           bg: '#e2e8f0' },
                    { label: 'Kendrapramuk',   count: kendraCount,     icon: <Shield size={24} color="#38a169" />,          bg: '#c6f6d5' },
                    { label: 'Mukhyadhyapak',  count: mukhaCount,      icon: <User size={24} color="var(--accent-navy)" />, bg: '#bee3f8' },
                    { label: 'Needs School',   count: provisionedCount, icon: <AlertCircle size={24} color="#d69e2e" />,    bg: '#fefcbf' },
                ].map(({ label, count, icon, bg }) => (
                    <Card key={label}>
                        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: bg, padding: '0.75rem', borderRadius: '50%' }}>{icon}</div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{loading ? '—' : count}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader title="All Users" />
                <CardContent>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={users} />
                    )}
                </CardContent>
            </Card>

            {/* ── Access Codes Panel ── */}
            {schoolsWithCodes.length > 0 && (
                <Card style={{ marginTop: '2rem' }}>
                    <CardHeader title="🔑 School Access Codes" />
                    <CardContent>
                        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                            Share these codes with verified teachers to allow registration. Only teachers with the correct code can create an account.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                            {schoolsWithCodes.map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-navy)' }}>{s.name.replace('ZP School ', '')}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#2d3748', letterSpacing: '1.5px', marginTop: '0.15rem' }}>{s.accessCode}</div>
                                    </div>
                                    <button
                                        onClick={() => copyCode(s.id, s.accessCode)}
                                        style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: copiedId === s.id ? '#c6f6d5' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                                        title="Copy code"
                                    >
                                        {copiedId === s.id ? <Check size={16} color="#38a169" /> : <Copy size={16} color="#718096" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserManagement;
