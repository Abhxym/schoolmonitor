"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import { PenTool, CheckCircle, Clock } from 'lucide-react';
import { getReports, submitReport } from '../../services/reports.service';
import { useAuth } from '../../hooks/useAuth';

const HeadmasterSubmitReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [activeForm, setActiveForm] = useState(null);

    useEffect(() => {
        getReports().then(setReports).catch(() => {});
    }, []);

    const handleClose = () => setActiveForm(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await submitReport({
                title: activeForm.title,
                period: form.period.value,
                status_detail: form.status_detail.value,
                remarks: form.remarks.value,
            });
            setReports(prev => prev.map(r => r.id === activeForm.id ? { ...r, status: 'submitted' } : r));
            toast.success('Report submitted to Kendrapramuk!');
        } catch {
            toast.error('Submission failed.');
        }
        handleClose();
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Submit Reports</h1>
                <p style={{ color: '#718096' }}>Fill out and submit dynamic forms requested by the Kendrapramuk.</p>
            </div>

            <Card>
                <CardHeader title="Pending Form Submissions" />
                <CardContent>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {reports.length === 0 && <p style={{ color: '#a0aec0' }}>No reports found.</p>}
                        {reports.map((form) => (
                            <div key={form._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: form.status === 'submitted' ? '#f8fafc' : 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '48px', height: '48px', backgroundColor: form.status === 'submitted' ? '#c6f6d5' : '#feebc8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {form.status === 'submitted' ? <CheckCircle color="#38a169" /> : <Clock color="#d69e2e" />}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: form.status === 'submitted' ? '#718096' : 'var(--accent-navy)' }}>{form.title}</h4>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#718096' }}>
                                            <span>Due: {form.date}</span>
                                            <span style={{ color: form.status === 'submitted' ? '#38a169' : '#e53e3e', fontWeight: 600, textTransform: 'capitalize' }}>{form.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`btn ${form.status === 'submitted' ? 'btn-outline' : 'btn-primary'}`}
                                    onClick={() => setActiveForm(form)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                                    disabled={form.status === 'submitted'}
                                >
                                    <PenTool size={18} /> {form.status === 'submitted' ? 'Completed' : 'Fill Form'}
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Modal isOpen={!!activeForm} onClose={handleClose} title={activeForm?.title || 'Report Form'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Complete all fields accurately. Data will be synced to the Kendrapramuk dashboard.
                    </p>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Reporting Period</label>
                        <input name="period" type="month" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Confirm Operational Status</label>
                        <select name="status_detail" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required>
                            <option value="">Select status...</option>
                            <option value="fully">Fully Operational</option>
                            <option value="partially">Partially Operational (Minor Issues)</option>
                            <option value="critical">Critical Issues (Needs Immediate Attention)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Detailed Remarks / Observations</label>
                        <textarea name="remarks" rows={4} className="form-input" placeholder="Enter any qualitative data or notes here..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }} required></textarea>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Report</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default HeadmasterSubmitReports;
