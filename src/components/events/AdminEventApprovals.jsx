"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { Calendar, MapPin, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEvents, updateEventStatus } from '../../services/events.service';

const AdminEventApprovals = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents({ status: 'pending' }).then(setEvents).catch(() => {});
    }, []);

    const handleAction = async (id, action) => {
        try {
            await updateEventStatus(id, action === 'approve' ? 'approved' : 'rejected');
            toast.success(`Event ${action === 'approve' ? 'approved' : 'rejected'}.`);
            setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
        } catch {
            toast.error('Action failed.');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Event & Media Approvals</h1>
                <p style={{ color: '#718096' }}>Review calendar events and gallery uploads requested by cluster schools before they go public.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {events.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #cbd5e0' }}>
                        <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>No pending approval requests.</p>
                    </div>
                ) : (
                    events.map((req) => (
                        <Card key={req._id || req.id}>
                            <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <Badge variant="warning">Event Registration</Badge>
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-navy)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{req.title}</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>School #{req.schoolId}</div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#a0aec0', fontFamily: 'monospace' }}>#{(req._id || req.id).toString().slice(-6)}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
                                        <Calendar size={16} color="var(--accent-gold)" /> <span>{req.date}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#718096', lineHeight: 1.5, marginTop: '0.5rem' }}>{req.description}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto', borderTop: '1px solid #edf2f7', paddingTop: '1rem' }}>
                                    <button className="btn btn-outline" style={{ color: '#e53e3e', borderColor: '#e53e3e', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleAction(req._id || req.id, 'reject')}>
                                        <X size={16} /> Reject
                                    </button>
                                    <button className="btn btn-primary" style={{ backgroundColor: '#38a169', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleAction(req._id || req.id, 'approve')}>
                                        <Check size={16} /> Approve
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminEventApprovals;
