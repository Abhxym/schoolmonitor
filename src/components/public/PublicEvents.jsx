"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Loader2, X, Tag, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Topbar from '../layout/Topbar';
import api from '../../services/axios';

const CATEGORIES = ['All', 'Sports', 'Academics', 'Arts & Culture', 'Administrative'];

const eventImages = [
    '/images/schools/school_cultural.png',
    '/images/schools/school_sports_day.png',
    '/images/schools/school_republic_day.png',
    '/images/schools/school_assembly.png',
];

const PublicEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        api.get('/events', { params: { status: 'approved' } })
            .then(r => setEvents(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--accent-navy)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            Campus <span className="text-gold">Events</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Approved upcoming events across our 12 cluster schools.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} style={{
                                padding: '0.6rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer',
                                border: `1px solid ${filter === cat ? 'var(--accent-navy)' : '#cbd5e0'}`,
                                backgroundColor: filter === cat ? 'var(--accent-navy)' : 'transparent',
                                color: filter === cat ? 'white' : '#4a5568',
                                transition: 'all 0.2s', fontSize: '0.9rem',
                            }}>{cat}</button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                            <Loader2 size={40} className="spinner" color="var(--accent-navy)" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#a0aec0' }}>
                            <p style={{ fontSize: '1.1rem' }}>No approved events in this category.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                            {filtered.map((event, i) => (
                                <div key={event._id || i} className="event-card" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid #edf2f7' }}>
                                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-navy)', zIndex: 10 }}>
                                            School #{event.schoolId}
                                        </div>
                                        {event.category && (
                                            <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'var(--accent-navy)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'white', zIndex: 10 }}>
                                                {event.category}
                                            </div>
                                        )}
                                        <img src={eventImages[i % eventImages.length]} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="event-img" />
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-navy)', marginBottom: '1rem', lineHeight: 1.4 }}>{event.title}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568', fontSize: '0.9rem' }}>
                                                <Calendar size={16} color="var(--accent-gold)" /> <span>{event.date}</span>
                                            </div>
                                        </div>
                                        <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>{event.description}</p>
                                        <button
                                            onClick={() => setSelectedEvent({ ...event, imgSrc: eventImages[i % eventImages.length] })}
                                            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--accent-navy)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, cursor: 'pointer', fontSize: '0.95rem', marginTop: '1rem' }}
                                            className="read-more-btn"
                                        >
                                            View Details <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Event Detail Modal ── */}
            <AnimatePresence>
                {selectedEvent && (
                    <div
                        onClick={() => setSelectedEvent(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                    >
                        <motion.div
                            onClick={e => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
                        >
                            {/* Event image */}
                            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                <img src={selectedEvent.imgSrc} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,33,71,0.7) 0%, transparent 60%)' }} />
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={18} color="#2d3748" />
                                </button>
                                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
                                    <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                        {selectedEvent.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Event details */}
                            <div style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', backgroundColor: '#f7fafc', borderRadius: '20px', fontSize: '0.85rem', color: '#4a5568' }}>
                                        <Calendar size={14} color="var(--accent-gold)" />
                                        {selectedEvent.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', backgroundColor: '#f7fafc', borderRadius: '20px', fontSize: '0.85rem', color: '#4a5568' }}>
                                        <School size={14} color="var(--accent-navy)" />
                                        School #{selectedEvent.schoolId}
                                    </div>
                                    {selectedEvent.category && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', backgroundColor: 'var(--accent-navy)', borderRadius: '20px', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                                            <Tag size={14} />
                                            {selectedEvent.category}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#a0aec0', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>About This Event</h4>
                                    <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                                        {selectedEvent.description}
                                    </p>
                                </div>

                                <div style={{ padding: '1.25rem', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #feebc8' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Event Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Status</span>
                                            <div style={{ fontWeight: 600, color: '#38a169', textTransform: 'capitalize' }}>
                                                {selectedEvent.status}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Organized By</span>
                                            <div style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>
                                                ZP School #{selectedEvent.schoolId}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--accent-navy)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .event-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,33,71,0.1) !important; }
                .event-card:hover .event-img { transform: scale(1.05); }
                .read-more-btn:hover { color: var(--accent-gold) !important; }
            `}</style>
        </div>
    );
};

export default PublicEvents;
