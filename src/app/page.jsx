import React from 'react';
import Topbar from '../components/layout/Topbar';
import HeroSection from '../components/hero/HeroSection';
import Modules from '../components/dashboard/Modules';
import Footer from '../components/layout/Footer';
import ImageCarousel from '../components/ui/ImageCarousel';

const indianSchoolImages = [
    '/images/schools/school_building_1.png',
    '/images/schools/school_classroom.png',
    '/images/schools/school_sports_day.png',
    '/images/schools/school_assembly.png',
    '/images/schools/school_cultural.png',
    '/images/schools/school_building_2.png',
    '/images/schools/school_science_lab.png',
    '/images/schools/school_computer_lab.png',
    '/images/schools/school_library.png',
    '/images/schools/school_republic_day.png',
    '/images/schools/school_playground.png',
    '/images/schools/school_midday_meal.png',
];

export default function LandingPage() {
    return (
        <main className="app-container">
            <Topbar />
            <HeroSection />
            <Modules />
            <div className="container" style={{ padding: '0 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-navy)', fontFamily: 'var(--font-serif)' }}>Our Connected <span className="text-gold">Campuses</span></h2>
                    <p style={{ color: '#4a5568', marginTop: '0.5rem' }}>Glimpses from the ZP schools in Chhatrapati Sambhajinagar district, Maharashtra.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
                    {/* Left Side: Carousel */}
                    <div style={{ height: '400px', minWidth: 0 }}>
                        <ImageCarousel images={indianSchoolImages} height="100%" autoPlayInterval={4000} />
                    </div>

                    {/* Right Side: Google Map of Maharashtra */}
                    <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120587.94763455498!2d75.2567744!3d19.8762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb9815a369bc63%3A0x712d538b29a2a73e!2sChhatrapati%20Sambhajinagar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709489241517!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Chhatrapati Sambhajinagar District Map"
                        ></iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
