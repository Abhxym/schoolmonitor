"use client";
import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Modal from '../ui/Modal';
import FileUpload from '../ui/FileUpload';
import toast from 'react-hot-toast';
import { FileUp, CalendarPlus, ImagePlus } from 'lucide-react';
import { submitAttendance } from '../../services/attendance.service';
import { createEvent } from '../../services/events.service';
import { useAuth } from '../../hooks/useAuth';

const HeadmasterSubmissions = () => {
    const { user } = useAuth();
    const [activeModal, setActiveModal] = useState(null);

    const handleClose = () => setActiveModal(null);

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await submitAttendance({
                schoolId: user.schoolId,
                date: form.date.value,
                present: parseInt(form.present.value),
                absent: parseInt(form.absent.value),
                total: parseInt(form.present.value) + parseInt(form.absent.value),
            });
            toast.success('Attendance submitted successfully.');
            handleClose();
        } catch { toast.error('Submission failed.'); }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await createEvent({
                title: form.title.value,
                date: form.date.value,
                description: form.description.value,
            });
            toast.success('Event submitted for approval.');
            handleClose();
        } catch { toast.error('Submission failed.'); }
    };

    const handlePhotoUpload = (files) => {
        toast('Gallery upload feature coming soon!', { icon: '🚧' });
        handleClose();
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Data Submissions</h1>
                <p style={{ color: '#718096' }}>Submit routine reports and manage school portal content.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <Card>
                    <CardHeader title="Daily Attendance Upload (Manual)" />
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <FileUp size={40} color="#4a5568" />
                        </div>
                        <p style={{ color: '#718096', marginBottom: '2rem' }}>Override biometric data or submit manual attendance sheets for the current day.</p>
                        <button className="btn btn-primary" onClick={() => setActiveModal('attendance')}>Open Form</button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Register Campus Event" />
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,33,71,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <CalendarPlus size={40} color="var(--accent-navy)" />
                        </div>
                        <p style={{ color: '#718096', marginBottom: '2rem' }}>Schedule assemblies, sports meets, or parent-teacher conferences.</p>
                        <button className="btn btn-primary" onClick={() => setActiveModal('event')}>Create Event</button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Upload Gallery Photos" />
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(212,175,55,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ImagePlus size={40} color="var(--accent-gold)" />
                        </div>
                        <p style={{ color: '#718096', marginBottom: '2rem' }}>Add high-quality images to the public-facing School Directory gallery.</p>
                        <button className="btn btn-primary" onClick={() => setActiveModal('photo')}>Upload Media</button>
                    </CardContent>
                </Card>
            </div>

            <Modal isOpen={activeModal === 'attendance'} onClose={handleClose} title="Manual Attendance Entry">
                <form onSubmit={handleAttendanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Target Date</label>
                        <input name="date" type="date" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Total Present (Count)</label>
                        <input name="present" type="number" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Total Absent (Count)</label>
                        <input name="absent" type="number" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Submit Record</button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'event'} onClose={handleClose} title="Event Registration">
                <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Event Title</label>
                        <input name="title" type="text" placeholder="e.g. Science Fair 2024" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date</label>
                            <input name="date" type="date" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
                            <input name="location" type="text" placeholder="Main Hall" className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                        <textarea name="description" rows={4} className="form-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Request Approval</button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'photo'} onClose={handleClose} title="Gallery Upload" maxWidth="600px">
                <div style={{ padding: '1rem 0' }}>
                    <FileUpload
                        onFileAccepted={handlePhotoUpload}
                        accept={{ "image/*": [".jpeg", ".png", ".jpg", ".webp"] }}
                        label="Drag & Drop High-Res Photos"
                    />
                </div>
            </Modal>

        </div>
    );
};

export default HeadmasterSubmissions;
