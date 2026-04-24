"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { Search, Download, Eye, FileText, Loader2, ExternalLink } from 'lucide-react';
import api from '../../services/axios';

const HeadmasterGRViewer = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [readIds, setReadIds] = useState(new Set());
    const [viewDoc, setViewDoc] = useState(null);

    useEffect(() => {
        api.get('/gr').then(r => setDocs(r.data)).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const markRead = (id) => setReadIds(prev => new Set([...prev, id]));
    const unreadCount = docs.filter(d => !readIds.has(d._id)).length;

    const handleView = (row) => {
        markRead(row._id);
        if (row.fileUrl) {
            setViewDoc(row);
        }
    };

    const columns = [
        { header: 'GR Number', key: 'grNumber', render: (v) => <span style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>{v}</span> },
        { header: 'Date Issued', key: 'date' },
        { header: 'Title', key: 'title', render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
        {
            header: 'Category', key: 'category',
            render: (v) => <span style={{ backgroundColor: '#edf2f7', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: '#4a5568' }}>{v}</span>
        },
        {
            header: 'Status', key: '_id',
            render: (id) => {
                const isRead = readIds.has(id);
                return <Badge variant={isRead ? 'default' : 'danger'}>{isRead ? 'Read' : 'Unread'}</Badge>;
            }
        },
        {
            header: 'Actions', key: '_id', sortable: false,
            render: (id, row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => handleView(row)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: row.fileUrl ? 'var(--accent-navy)' : '#a0aec0', cursor: row.fileUrl ? 'pointer' : 'not-allowed' }}
                        title={row.fileUrl ? 'View document' : 'No file attached'}
                    >
                        <Eye size={15} /> View
                    </button>
                    {row.fileUrl ? (
                        <a href={row.fileUrl} target="_blank" rel="noreferrer"
                            onClick={() => markRead(id)}
                            style={{ padding: '0.4rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38a169', textDecoration: 'none', fontSize: '0.8rem' }}
                            title="Download file">
                            <Download size={15} /> Download
                        </a>
                    ) : (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.4, cursor: 'not-allowed', fontSize: '0.8rem' }} title="No file attached" disabled>
                            <Download size={15} /> N/A
                        </button>
                    )}
                </div>
            )
        },
    ];

    const filtered = docs.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.grNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Government Resolutions (GR)</h1>
                <p style={{ color: '#718096' }}>View and acknowledge official notices from the Kendrapramuk.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card style={{ borderLeft: '4px solid #e53e3e' }}>
                    <CardContent style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#fed7d7', padding: '1rem', borderRadius: '50%' }}>
                            <FileText size={24} color="#e53e3e" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>Unread Notices</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{unreadCount}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#e2e8f0', padding: '1rem', borderRadius: '50%' }}>
                            <FileText size={24} color="#4a5568" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>Total Documents</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-navy)' }}>{docs.length}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader title="Document Repository" />
                <CardContent>
                    <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
                        <Search size={18} color="#a0aec0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by GR Number or Title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem' }}
                        />
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={filtered} />
                    )}
                </CardContent>
            </Card>

            {/* ── Document Viewer Modal ── */}
            <Modal isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title="Document Viewer" maxWidth="700px">
                {viewDoc && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Document header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.25rem' }}>GR NUMBER</div>
                                <span style={{ fontWeight: 700, color: 'var(--accent-navy)', fontSize: '1.1rem' }}>{viewDoc.grNumber}</span>
                            </div>
                            <Badge variant="success">{viewDoc.status || 'Active'}</Badge>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.25rem' }}>TITLE</div>
                            <h3 style={{ margin: 0, color: 'var(--accent-navy)', fontSize: '1.15rem' }}>{viewDoc.title}</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Category</div>
                                <div style={{ fontWeight: 600, color: '#2d3748' }}>{viewDoc.category}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Date Issued</div>
                                <div style={{ fontWeight: 600, color: '#2d3748' }}>{viewDoc.date}</div>
                            </div>
                        </div>

                        {/* Document preview */}
                        {viewDoc.fileUrl && (
                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.5rem' }}>DOCUMENT PREVIEW</div>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f7fafc' }}>
                                    {viewDoc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                        <img src={viewDoc.fileUrl} alt={viewDoc.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                                    ) : viewDoc.fileUrl.match(/\.pdf$/i) ? (
                                        <iframe src={viewDoc.fileUrl} style={{ width: '100%', height: '400px', border: 'none' }} title={viewDoc.title} />
                                    ) : (
                                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                                            <FileText size={48} color="#a0aec0" style={{ marginBottom: '0.75rem' }} />
                                            <p style={{ color: '#718096', margin: 0, fontSize: '0.95rem' }}>
                                                This document type cannot be previewed inline.
                                            </p>
                                            <p style={{ color: '#a0aec0', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                                                Use the button below to open or download.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                            <a
                                href={viewDoc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--accent-navy)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'opacity 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <ExternalLink size={18} /> Open in New Tab
                            </a>
                            <a
                                href={viewDoc.fileUrl}
                                download
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px solid #e2e8f0', color: '#4a5568', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f7fafc'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <Download size={18} /> Download
                            </a>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HeadmasterGRViewer;
