"use client";
import React, { useState } from 'react';
import Topbar from '../layout/Topbar';

const CATEGORIES = ['All', 'Classrooms', 'Sports', 'Events', 'Infrastructure'];

const galleryItems = [
    { id: 1,  src: '/images/schools/school_building_1.png',  school: 'ZP School Paithan',          category: 'Infrastructure' },
    { id: 2,  src: '/images/schools/school_classroom.png',   school: 'ZP School Kannad',            category: 'Classrooms' },
    { id: 3,  src: '/images/schools/school_sports_day.png',  school: 'ZP School Phulambri',         category: 'Sports' },
    { id: 4,  src: '/images/schools/school_assembly.png',    school: 'ZP School Sillod',            category: 'Events' },
    { id: 5,  src: '/images/schools/school_cultural.png',    school: 'ZP School Vaijapur',          category: 'Events' },
    { id: 6,  src: '/images/schools/school_building_2.png',  school: 'ZP School Gangapur',          category: 'Infrastructure' },
    { id: 7,  src: '/images/schools/school_science_lab.png', school: 'ZP School Khuldabad',         category: 'Classrooms' },
    { id: 8,  src: '/images/schools/school_computer_lab.png',school: 'ZP School Soegaon',           category: 'Classrooms' },
    { id: 9,  src: '/images/schools/school_library.png',     school: 'ZP School Aurangabad City',   category: 'Infrastructure' },
    { id: 10, src: '/images/schools/school_republic_day.png',school: 'ZP School Jalna Road',        category: 'Events' },
    { id: 11, src: '/images/schools/school_playground.png',  school: 'ZP School Begumpura',         category: 'Sports' },
    { id: 12, src: '/images/schools/school_midday_meal.png', school: 'ZP School Waluj',             category: 'Sports' },
];

const GalleryView = () => {
    const [filter, setFilter] = useState('All');
    const [lightbox, setLightbox] = useState(null);

    const filtered = filter === 'All' ? galleryItems : galleryItems.filter(g => g.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--accent-navy)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            Campus <span className="text-gold">Gallery</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            A visual journey through all 12 Zilla Parishad schools in Chhatrapati Sambhajinagar, Maharashtra.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} style={{
                                padding: '0.5rem 1.25rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                                border: `1px solid ${filter === cat ? 'var(--accent-navy)' : '#cbd5e0'}`,
                                backgroundColor: filter === cat ? 'var(--accent-navy)' : 'transparent',
                                color: filter === cat ? 'white' : '#4a5568', transition: 'all 0.2s',
                            }}>{cat}</button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filtered.map(item => (
                            <div key={item.id} onClick={() => setLightbox(item)}
                                style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                className="gallery-card">
                                <div style={{ height: '250px', backgroundImage: `url(${item.src})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s' }} className="gallery-img" />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,33,71,0.85))', color: 'white' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.school}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.category}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {lightbox && (
                <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                        <img src={lightbox.src} alt={lightbox.school} style={{ width: '100%', display: 'block' }} />
                        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>{lightbox.school}</div>
                                <div style={{ fontSize: '0.85rem', color: '#718096' }}>{lightbox.category}</div>
                            </div>
                            <button onClick={() => setLightbox(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096' }}>✕</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .gallery-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,33,71,0.15) !important; }
                .gallery-card:hover .gallery-img { transform: scale(1.05); }
            `}</style>
        </div>
    );
};

export default GalleryView;
