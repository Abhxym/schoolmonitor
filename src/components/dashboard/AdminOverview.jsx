"use client";
import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import DataTable from '../ui/DataTable';
import { SkeletonCard, SkeletonTable } from '../ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, Download } from 'lucide-react';
import { getAttendance } from '../../services/attendance.service';
import { getReports } from '../../services/reports.service';
import api from '../../services/axios';
import { exportToExcel } from '../../utils/exportExcel';

const AdminOverview = () => {
    const [attendance, setAttendance] = useState([]);
    const [reports, setReports] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAttendance().then(setAttendance).catch(() => {}),
            getReports().then(setReports).catch(() => {}),
            api.get('/schools').then(r => setSchools(r.data)).catch(() => {}),
        ]).finally(() => setLoading(false));
    }, []);

    const totalStudents  = attendance.reduce((s, a) => s + a.total, 0);
    const totalPresent   = attendance.reduce((s, a) => s + a.present, 0);
    const attendanceRate = totalStudents ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;
    const pendingReports = reports.filter(r => r.status === 'pending').length;

    const chartData = attendance.map(a => ({ name: `S${a.schoolId}`, present: a.present, absent: a.absent }));

    const schoolPerf = schools.map(s => {
        const att = attendance.filter(a => a.schoolId === s.id);
        const rate = att.length
            ? att.reduce((sum, a) => sum + (a.total ? (a.present / a.total) * 100 : 0), 0) / att.length
            : 0;
        return {
            name: s.name.replace('Zilla Parishad School ', ''),
            rate: parseFloat(rate.toFixed(1)),
            color: rate >= 95 ? '#38a169' : rate >= 90 ? '#d69e2e' : '#e53e3e',
        };
    }).sort((a, b) => b.rate - a.rate).slice(0, 4);

    const columns = [
        { header: 'School ID', key: 'schoolId' },
        { header: 'Date',      key: 'date' },
        { header: 'Total',   key: 'total',   render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
        { header: 'Present', key: 'present', render: v => <span style={{ color: '#38a169', fontWeight: 600 }}>{v}</span> },
        { header: 'Absent',  key: 'absent',  render: v => <span style={{ color: '#e53e3e', fontWeight: 600 }}>{v}</span> },
        { header: 'Rate', key: 'present', render: (v, row) => <span style={{ fontWeight: 700 }}>{row.total ? ((v / row.total) * 100).toFixed(1) : 0}%</span> },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Overview Dashboard</h1>
                    <p style={{ color: '#718096' }}>Global network analytics and system status.</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                    onClick={() => exportToExcel(attendance, 'network_attendance_report')}>
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {loading ? [1,2,3].map(i => <SkeletonCard key={i} rows={2} />) : (
                    <>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Students Tracked</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{totalStudents.toLocaleString()}</div>
                                <span style={{ color: '#38a169', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}><ArrowUpRight size={16} /> Live</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Global Attendance Rate</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{attendanceRate}%</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending Reports</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: pendingReports > 0 ? '#e53e3e' : 'var(--accent-navy)' }}>{pendingReports}</div>
                                <span style={{ color: '#718096', fontSize: '0.85rem' }}>Across {schools.length} schools</span>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Charts */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                    <SkeletonCard rows={6} />
                    <SkeletonCard rows={6} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                    <Card>
                        <CardHeader title="Network Attendance Analytics" />
                        <CardContent>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096' }} />
                                        <Tooltip cursor={{ fill: 'rgba(0,33,71,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Legend />
                                        <Bar dataKey="present" name="Present" fill="var(--accent-navy)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="absent"  name="Absent"  fill="#cbd5e0"            radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title="School Performance (Top 4)" />
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {schoolPerf.map((school, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: 500 }}>{school.name}</span>
                                            <span style={{ fontWeight: 600 }}>{school.rate}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${school.rate}%`, height: '100%', backgroundColor: school.color, borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Table */}
            <Card>
                <CardHeader title="All Schools Attendance" />
                <CardContent>
                    {loading ? <SkeletonTable rows={6} cols={6} /> : <DataTable columns={columns} data={attendance} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOverview;
