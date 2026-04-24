"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, height = "400px", autoPlayInterval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [images, autoPlayInterval]);

    if (!images || images.length === 0) return null;

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', borderRadius: '12px', backgroundColor: '#e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

            {/* 100% pre-mounted CSS flexbox row. Natively prevents any DOM mount/unmount lag. */}
            <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform'
            }}>
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Slide ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }}
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : "auto"}
                    />
                ))}
            </div>

            {/* Navigation Overlays */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem', pointerEvents: 'none' }}>
                <button
                    onClick={handlePrevious}
                    style={{ pointerEvents: 'auto', backgroundColor: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.2s', backdropFilter: 'blur(4px)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'}
                >
                    <ChevronLeft size={24} color="var(--accent-navy)" />
                </button>
                <button
                    onClick={handleNext}
                    style={{ pointerEvents: 'auto', backgroundColor: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.2s', backdropFilter: 'blur(4px)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'}
                >
                    <ChevronRight size={24} color="var(--accent-navy)" />
                </button>
            </div>

            {/* Indicators */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: idx === currentIndex ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: idx === currentIndex ? 'var(--accent-gold)' : 'rgba(255,255,255,0.6)',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
