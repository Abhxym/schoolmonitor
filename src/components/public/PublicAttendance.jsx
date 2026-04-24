"use client";
import React, { useEffect, useState } from 'react';
import Topbar from '../layout/Topbar';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '../../services/axios';

const PublicAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/attendance').then(r => setAttendance(r.data)).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const totalStudents = attendance.reduce((s, a) => s + a.total, 0);
    const totalPresent = attendance.reduce((s, a) => s + a.present, 0);
    const rate = totalStudents ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;

    // Group by date for chart
    const byDate = attendance.reduce((acc, a) => {
        if (!acc[a.date]) acc[a.date] = { date: a.date, present: 0, total: 0 };
        acc[a.date].present += a.present;
        acc[a.date].total += a.total;
        return acc;
    }, {});
    const chartData = Object.values(byDate).map(d => ({
        date: d.date,
        rate: d.total ? parseFloat(((d.present / d.total) * 100).toFixed(1)) : 0,
        target: 95,
    }));

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--accent-navy)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            Transparency <span className="text-gold">Metrics</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Real-time aggregate attendance across all 12 schools in our cluster.
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                            <Loader2 size={40} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 300px)', gap: '2rem', alignItems: 'start' }}>
                            <Card>
                                <CardHeader title="District Aggregate Attendance" />
                                <CardContent style={{ padding: '0 1.5rem 1.5rem', height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} dx={-10} domain={[80, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} formatter={(v) => [`${v}%`]} />
                                            <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" name="Target (95%)" dot={false} />
                                            <Line type="monotone" dataKey="rate" stroke="var(--accent-gold)" strokeWidth={3} dot={{ stroke: 'var(--accent-gold)', strokeWidth: 2, r: 4, fill: 'white' }} activeDot={{ r: 6, fill: 'var(--accent-navy)' }} name="Actual Rate" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Card style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                                    <CardContent style={{ padding: '1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Current Rate</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{rate}%</div>
                                        <div style={{ fontSize: '0.9rem', color: rate >= 95 ? '#38a169' : '#e53e3e', marginTop: '0.25rem', fontWeight: 500 }}>
                                            {rate >= 95 ? `+${(rate - 95).toFixed(1)}% above target` : `${(95 - rate).toFixed(1)}% below target`}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent style={{ padding: '1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>Network Summary</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Students</span><strong>{totalStudents.toLocaleString()}</strong></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Present Today</span><strong style={{ color: '#38a169' }}>{totalPresent.toLocaleString()}</strong></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Absent Today</span><strong style={{ color: '#e53e3e' }}>{(totalStudents - totalPresent).toLocaleString()}</strong></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Schools Reporting</span><strong>{attendance.length}</strong></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PublicAttendance;
