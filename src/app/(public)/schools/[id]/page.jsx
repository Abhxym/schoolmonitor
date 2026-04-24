"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '../../../../components/layout/Topbar';
import Card, { CardHeader, CardContent } from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { ArrowLeft, Users, BookOpen, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '../../../../services/axios';

export default function SchoolDetailPage() {
    const { id } = useParams();
    const [school, setSchool] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/schools/${id}`).then(r => setSchool(r.data)),
            api.get('/attendance', { params: { schoolId: id } }).then(r => setAttendance(r.data)),
        ]).catch(() => {}).finally(() => setLoading(false));
    }, [id]);

    const latestAtt = attendance[attendance.length - 1];
    const attRate = latestAtt?.total ? ((latestAtt.present / latestAtt.total) * 100).toFixed(1) : null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0' }}>
            <Topbar />
            <main style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
                    <Link href="/schools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#718096', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
                        <ArrowLeft size={18} /> Back to Directory
                    </Link>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                            <Loader2 size={40} color="var(--accent-navy)" style={{ animation: 'spin 0.8s linear infinite' }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : !school ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>School not found.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', margin: 0 }}>{school.name}</h1>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096' }}>
                                        <MapPin size={16} /> <span>{school.district} District, Maharashtra</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Total Students', value: school.students, icon: <Users size={24} color="var(--accent-navy)" />, bg: '#ebf8ff' },
                                    { label: 'Teachers',       value: school.teachers, icon: <BookOpen size={24} color="#38a169" />,          bg: '#f0fff4' },
                                    { label: 'Attendance Rate', value: attRate ? `${attRate}%` : '—', icon: <Users size={24} color="var(--accent-gold)" />, bg: '#fffbeb' },
                                ].map(({ label, value, icon, bg }) => (
                                    <Card key={label}>
                                        <CardContent style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ backgroundColor: bg, padding: '0.75rem', borderRadius: '50%' }}>{icon}</div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{value}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Card>
                                <CardHeader title="Attendance History" />
                                <CardContent>
                                    {attendance.length === 0 ? (
                                        <p style={{ color: '#a0aec0' }}>No attendance records yet.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {attendance.slice().reverse().map(a => (
                                                <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                                                    <span style={{ color: '#4a5568', fontWeight: 500 }}>{a.date}</span>
                                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                                                        <span style={{ color: '#38a169', fontWeight: 600 }}>Present: {a.present}</span>
                                                        <span style={{ color: '#e53e3e', fontWeight: 600 }}>Absent: {a.absent}</span>
                                                        <span style={{ color: 'var(--accent-navy)', fontWeight: 700 }}>
                                                            {a.total ? ((a.present / a.total) * 100).toFixed(1) : 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
