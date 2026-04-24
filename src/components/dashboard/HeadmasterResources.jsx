"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Download, FileText, Database, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportExcel';
import { getAttendance } from '../../services/attendance.service';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/axios';

const HeadmasterResources = () => {
    const { user } = useAuth();
    const [grDocs, setGrDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/gr')
            .then(r => setGrDocs(r.data))
            .catch(() => toast.error('Failed to load documents.'))
            .finally(() => setLoading(false));
    }, []);

    const handleDownload = async (doc) => {
        if (doc.fileUrl) {
            window.open(doc.fileUrl, '_blank');
            return;
        }
        toast.error('File not yet uploaded by Kendrapramuk.');
    };

    const handleExportAttendance = async () => {
        try {
            const data = await getAttendance({ schoolId: user?.schoolId });
            exportToExcel(data, 'attendance_register');
        } catch {
            toast.error('Export failed.');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>System Resources</h1>
                <p style={{ color: '#718096' }}>Download official registers, templates, and protocols.</p>
            </div>

            {/* Quick Export */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card style={{ cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-bg" onClick={handleExportAttendance}>
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,33,71,0.06)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Database color="var(--accent-navy)" size={22} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--accent-navy)' }}>Export Attendance</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>Download your school&apos;s attendance as Excel</p>
                        </div>
                        <Download size={18} color="#a0aec0" style={{ marginLeft: 'auto' }} />
                    </div>
                </Card>
                <Card style={{ cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-bg" onClick={() => {
                    exportToExcel(
                        [{ date: '', present: '', absent: '', total: '', remarks: '' }],
                        'attendance_template'
                    );
                }}>
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText color="var(--accent-gold)" size={22} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--accent-navy)' }}>Blank Template</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>Download empty attendance template</p>
                        </div>
                        <Download size={18} color="#a0aec0" style={{ marginLeft: 'auto' }} />
                    </div>
                </Card>
            </div>

            {/* GR Documents from API */}
            <Card>
                <CardHeader title="Official GR Documents" />
                <CardContent>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={28} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : grDocs.length === 0 ? (
                        <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>No documents published yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {grDocs.map((doc) => (
                                <div
                                    key={doc._id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem 1.5rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s',
                                    }}
                                    className="hover-bg"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                                        <div style={{ width: '44px', height: '44px', backgroundColor: '#f7fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <FileText color="#718096" size={20} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', color: 'var(--accent-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</h4>
                                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#718096', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 600, color: '#4a5568' }}>{doc.grNumber}</span>
                                                <span>&bull;</span>
                                                <span>{doc.category}</span>
                                                <span>&bull;</span>
                                                <span>{doc.date}</span>
                                                {doc.uploadedBy && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span>By {doc.uploadedBy}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="btn btn-outline"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.85rem', flexShrink: 0 }}
                                    >
                                        {doc.fileUrl ? <><ExternalLink size={14} /> Open</> : <><Download size={14} /> Pending</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            <style>{`
        .hover-bg:hover { background-color: #fcfaf0; border-color: #feebc8 !important; }
      `}</style>
        </div>
    );
};

export default HeadmasterResources;
