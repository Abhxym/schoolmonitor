"use client";
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Topbar from '../layout/Topbar';
import Card, { CardContent } from '../ui/Card';
import toast from 'react-hot-toast';
import api from '../../services/axios';

const PublicContact = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const f = e.target;
        try {
            await api.post('/contact', {
                firstName: f.firstName.value,
                lastName: f.lastName.value,
                email: f.email.value,
                topic: f.topic.value,
                message: f.message.value,
            });
            toast.success('Message received! A confirmation email has been sent to you.');
            e.target.reset();
        } catch {
            toast.error('Failed to send. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--accent-navy)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            Get in <span className="text-gold">Touch</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Have questions about our cluster schools or the new monitoring portal? Send a message to the Central Administration.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem' }}>
                        <div>
                            <Card>
                                <CardContent style={{ padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-navy)', marginBottom: '1.5rem' }}>Send us a message</h3>
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
                                                <input name="firstName" type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
                                                <input name="lastName" type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                                            <input name="email" type="email" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nature of Inquiry</label>
                                            <select name="topic" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} required>
                                                <option value="">Select a topic...</option>
                                                <option value="admissions">School Admissions</option>
                                                <option value="portal">Portal Access Issue</option>
                                                <option value="feedback">General Feedback</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                                            <textarea name="message" rows={5} className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }} required></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}>
                                            Submit Inquiry <Send size={18} />
                                        </button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <CardContent style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                    <div style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '50%' }}>
                                        <MapPin size={24} color="var(--accent-navy)" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>Central Office</h4>
                                        <p style={{ color: '#4a5568', lineHeight: 1.5 }}>
                                            Zilla Parishad Bhavan<br />
                                            Kranti Chowk, Chh. Sambhajinagar 431001<br />
                                            Maharashtra, India
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                    <div style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '50%' }}>
                                        <Phone size={24} color="var(--accent-navy)" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>Phone Directory</h4>
                                        <p style={{ color: '#4a5568', lineHeight: 1.5 }}>
                                            <strong>Helpdesk:</strong> +91 240-261-3456<br />
                                            <strong>Admissions:</strong> +91 240-261-3457<br />
                                            <span style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem', display: 'block' }}>Available Mon-Fri, 9am - 5pm</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                    <div style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '50%' }}>
                                        <Mail size={24} color="var(--accent-navy)" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>Email Contacts</h4>
                                        <p style={{ color: '#4a5568', lineHeight: 1.5 }}>
                                            <strong>General:</strong> kendrapramuk@zp.edu<br />
                                            <strong>Support:</strong> support@zpscms.edu
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicContact;
