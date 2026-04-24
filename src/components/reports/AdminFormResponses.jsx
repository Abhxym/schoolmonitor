"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { Download, Eye, Loader2, CheckCircle, Flag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getReports, updateReportStatus } from '../../services/reports.service';
import { exportToExcel } from '../../utils/exportExcel';

const AdminFormResponses = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewReport, setViewReport] = useState(null);

    useEffect(() => {
        getReports().then(setReports).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updated = await updateReportStatus(id, status);
            setReports(prev => prev.map(r => (r._id || r.id) === id ? { ...r, ...updated } : r));
            toast.success(`Report marked as ${status}.`);
            // Update the modal view too if open
            if (viewReport && (viewReport._id || viewReport.id) === id) {
                setViewReport(prev => ({ ...prev, status }));
            }
        } catch { toast.error('Update failed.'); }
    };

    const filtered = statusFilter === 'all' ? reports : reports.filter(r => r.status === statusFilter);

    const columns = [
        { header: 'School', key: 'schoolId', render: (v) => <span style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>School {v}</span> },
        { header: 'Date', key: 'date' },
        { header: 'Title', key: 'title' },
        { header: 'Submitted By', key: 'submittedBy' },
        {
            header: 'Status', key: 'status',
            render: (v) => {
                const map = { submitted: 'primary', reviewed: 'success', pending: 'warning', flagged: 'danger' };
                return <Badge variant={map[v] || 'default'}>{v}</Badge>;
            }
        },
        {
            header: 'Actions', key: '_id', sortable: false,
            render: (id, row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setViewReport(row)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                        <Eye size={14} style={{ marginRight: '0.25rem' }} /> View
                    </button>
                    {(row.status === 'submitted' || row.status === 'pending') && (
                        <>
                            <button onClick={() => handleStatusChange(id, 'reviewed')} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#38a169', borderColor: '#38a169' }}>
                                ✓ Review
                            </button>
                            <button onClick={() => handleStatusChange(id, 'flagged')} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#e53e3e', borderColor: '#e53e3e' }}>
                                ⚑ Flag
                            </button>
                        </>
                    )}
                </div>
            )
        },
    ];

    const submittedCount = reports.filter(r => r.status === 'submitted').length;
    const reviewedCount = reports.filter(r => r.status === 'reviewed').length;
    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const flaggedCount = reports.filter(r => r.status === 'flagged').length;

    const statusColor = (s) => {
        const m = { submitted: '#2b6cb0', reviewed: '#38a169', pending: '#d69e2e', flagged: '#e53e3e' };
        return m[s] || '#718096';
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Form Responses</h1>
                    <p style={{ color: '#718096' }}>Review and action report submissions from all 12 schools.</p>
                </div>
                <button className="btn btn-primary" onClick={() => exportToExcel(reports, 'form_responses')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Submitted', count: submittedCount, color: '#2b6cb0' },
                    { label: 'Reviewed', count: reviewedCount, color: '#38a169' },
                    { label: 'Pending', count: pendingCount, color: '#d69e2e' },
                    { label: 'Flagged', count: flaggedCount, color: '#e53e3e' },
                    { label: 'Total', count: reports.length, color: '#718096' },
                ].map(({ label, count, color }) => (
                    <Card key={label} style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                        onClick={() => setStatusFilter(label.toLowerCase() === 'total' ? 'all' : label.toLowerCase())}>
                        <CardContent style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{loading ? '—' : count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader
                    title="All Submissions"
                    action={
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: '#4a5568', outline: 'none' }}>
                            <option value="all">All Statuses</option>
                            <option value="submitted">Submitted</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="pending">Pending</option>
                            <option value="flagged">Flagged</option>
                        </select>
                    }
                />
                <CardContent>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={filtered} />
                    )}
                </CardContent>
            </Card>

            {/* ── Report Detail Modal ── */}
            <Modal isOpen={!!viewReport} onClose={() => setViewReport(null)} title="Report Details" maxWidth="580px">
                {viewReport && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Header info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Badge variant={{ submitted: 'primary', reviewed: 'success', pending: 'warning', flagged: 'danger' }[viewReport.status] || 'default'}>
                                {viewReport.status}
                            </Badge>
                            <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>School {viewReport.schoolId}</span>
                        </div>

                        {/* Report title */}
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.25rem' }}>Title</div>
                            <h3 style={{ margin: 0, color: 'var(--accent-navy)', fontSize: '1.15rem' }}>{viewReport.title}</h3>
                        </div>

                        {/* Details grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Submitted By</div>
                                <div style={{ fontWeight: 600, color: '#2d3748' }}>{viewReport.submittedBy}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Date</div>
                                <div style={{ fontWeight: 600, color: '#2d3748' }}>{viewReport.date}</div>
                            </div>
                            {viewReport.period && (
                                <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Reporting Period</div>
                                    <div style={{ fontWeight: 600, color: '#2d3748' }}>{viewReport.period}</div>
                                </div>
                            )}
                            {viewReport.status_detail && (
                                <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.3rem' }}>Operational Status</div>
                                    <div style={{ fontWeight: 600, color: '#2d3748', textTransform: 'capitalize' }}>{viewReport.status_detail}</div>
                                </div>
                            )}
                        </div>

                        {/* Remarks */}
                        {viewReport.remarks && (
                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.5rem' }}>Remarks / Observations</div>
                                <div style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #feebc8', borderRadius: '8px', color: '#2d3748', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                    {viewReport.remarks}
                                </div>
                            </div>
                        )}

                        {/* No content notice for pending */}
                        {!viewReport.period && !viewReport.remarks && !viewReport.status_detail && (
                            <div style={{ padding: '1.5rem', backgroundColor: '#f7fafc', borderRadius: '8px', textAlign: 'center', color: '#a0aec0' }}>
                                <FileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p style={{ margin: 0 }}>This report has not been filled out yet by the headmaster.</p>
                            </div>
                        )}

                        {/* Action buttons */}
                        {(viewReport.status === 'submitted' || viewReport.status === 'pending') && (
                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                                <button
                                    onClick={() => handleStatusChange(viewReport._id, 'reviewed')}
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem' }}
                                >
                                    <CheckCircle size={18} /> Mark as Reviewed
                                </button>
                                <button
                                    onClick={() => handleStatusChange(viewReport._id, 'flagged')}
                                    className="btn btn-outline"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem', color: '#e53e3e', borderColor: '#e53e3e' }}
                                >
                                    <Flag size={18} /> Flag for Issues
                                </button>
                            </div>
                        )}

                        {/* Already actioned */}
                        {viewReport.status === 'reviewed' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '8px', color: '#276749' }}>
                                <CheckCircle size={18} /> This report has been reviewed and accepted.
                            </div>
                        )}
                        {viewReport.status === 'flagged' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', color: '#9b2c2c' }}>
                                <Flag size={18} /> This report has been flagged for issues.
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminFormResponses;
