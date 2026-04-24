"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Calendar, CheckCircle2, Loader2, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useAttendance } from '../../hooks/useAttendance';
import { useAuth } from '../../hooks/useAuth';
import { getReports } from '../../services/reports.service';
import { SkeletonCard } from '../ui/Skeleton';

const HeadmasterOverview = () => {
    const { user } = useAuth();
    const { data: attendance, loading: attLoading } = useAttendance(
        user?.schoolId ? { schoolId: user.schoolId } : null
    );
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);

    useEffect(() => {
        getReports().then(setReports).catch(() => {}).finally(() => setReportsLoading(false));
    }, []);

    const todayAtt = attendance[attendance.length - 1];
    const attRate = todayAtt?.total ? ((todayAtt.present / todayAtt.total) * 100).toFixed(1) : null;
    const pendingReports = reports.filter((r) => r.status === 'pending').length;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>
                    Namaskar, {user?.name?.split(' ').slice(-1)[0]}
                </h1>
                <p style={{ color: '#718096' }}>Manage reporting and view incoming administrative directives.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {attLoading ? [1, 2, 3].map((i) => <SkeletonCard key={i} rows={1} />) : (
                    <>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Today's Attendance</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{attRate ? `${attRate}%` : '-'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Total Students</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{todayAtt?.total ?? '-'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Pending Reports</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: pendingReports > 0 ? '#e53e3e' : '#38a169' }}>{reportsLoading ? '-' : pendingReports}</div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card style={{ borderLeft: '4px solid #dd6b20' }}>
                        <CardHeader title="Action Required: Pending Forms" />
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {reportsLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}><Loader2 size={20} className="spinner" /></div>
                                ) : pendingReports === 0 ? (
                                    <p style={{ color: '#38a169', fontWeight: 500 }}>All reports submitted.</p>
                                ) : reports.filter((r) => r.status === 'pending').map((r) => (
                                    <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#fffaf0', borderRadius: '8px' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#2d3748' }}>{r.title}</h4>
                                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>Due: {r.date}</span>
                                        </div>
                                        <Link href="/submit-reports" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                            Complete Now
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Link href="/data-submissions" style={{ textDecoration: 'none' }}>
                            <Card style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }} className="hover-lift">
                                <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(0,33,71,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Calendar size={32} color="var(--accent-navy)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-navy)' }}>Submit Attendance</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Submit today's attendance or register a campus event.</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/submit-reports" style={{ textDecoration: 'none' }}>
                            <Card style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }} className="hover-lift">
                                <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <CheckCircle2 size={32} color="var(--accent-gold)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-navy)' }}>Submit Reports</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Fill and submit forms requested by the Kendrapramuk.</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div>
                    <Card>
                        <CardHeader title="Latest Attendance" action={<ClipboardList size={18} color="#a0aec0" />} />
                        <CardContent>
                            {attLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader2 size={24} className="spinner" /></div>
                            ) : attendance.length === 0 ? (
                                <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No attendance records yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {attendance.slice(-5).reverse().map((record) => (
                                        <div key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#4a5568' }}>{record.date}</span>
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                                <span style={{ color: '#38a169', fontWeight: 600 }}>P: {record.present}</span>
                                                <span style={{ color: '#e53e3e', fontWeight: 600 }}>A: {record.absent}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <style>{`.hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }`}</style>
        </div>
    );
};

export default HeadmasterOverview;
