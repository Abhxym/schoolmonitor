"use client";
import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import { Filter, Download, Calendar, Loader2 } from 'lucide-react';
import { useAttendance } from '../../hooks/useAttendance';
import { exportToExcel } from '../../utils/exportExcel';

const AdminAttendance = () => {
    const { data, loading } = useAttendance();
    const [dateFilter, setDateFilter] = useState('');

    const filtered = dateFilter ? data.filter(a => a.date === dateFilter) : data;

    const totalStudents = data.reduce((s, a) => s + a.total, 0);
    const totalPresent = data.reduce((s, a) => s + a.present, 0);
    const avgRate = totalStudents ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;
    const pendingCount = data.filter(a => a.present === 0).length;

    const columns = [
        { header: 'School ID', key: 'schoolId' },
        { header: 'Date', key: 'date' },
        { header: 'Total', key: 'total', render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
        { header: 'Present', key: 'present', render: (v) => <span style={{ color: '#38a169', fontWeight: 600 }}>{v}</span> },
        { header: 'Absent', key: 'absent', render: (v) => <span style={{ color: '#e53e3e', fontWeight: 600 }}>{v}</span> },
        {
            header: 'Rate (%)',
            key: 'present',
            render: (v, row) => {
                const rate = row.total ? ((v / row.total) * 100).toFixed(1) : 0;
                return <span style={{ fontWeight: 700, color: rate < 90 ? '#e53e3e' : rate < 95 ? '#d69e2e' : 'var(--accent-navy)' }}>{rate}%</span>;
            }
        },
        {
            header: 'Status',
            key: 'present',
            render: (v) => {
                const submitted = v > 0;
                return <Badge variant={submitted ? 'success' : 'warning'}>{submitted ? 'Submitted' : 'Pending'}</Badge>;
            }
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Attendance Overview</h1>
                    <p style={{ color: '#718096' }}>Monitor daily submissions across all 12 schools.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem 0.75rem', backgroundColor: '#f8fafc' }}>
                        <Calendar size={16} color="#718096" />
                        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#4a5568', cursor: 'pointer' }} />
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                        onClick={() => exportToExcel(filtered, 'attendance')}>
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <CardContent style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Avg Attendance Rate</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{loading ? '—' : `${avgRate}%`}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Pending Submissions</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e53e3e' }}>{loading ? '—' : pendingCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Total Schools Tracked</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-navy)' }}>12</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent style={{ padding: '1.5rem' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={filtered} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAttendance;
