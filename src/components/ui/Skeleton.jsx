"use client";
import React from 'react';

const pulse = `
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}`;

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', style = {} }) {
    return (
        <>
            <div style={{ width, height, borderRadius, backgroundColor: '#e2e8f0', animation: 'skeleton-pulse 1.5s ease-in-out infinite', ...style }} />
            <style>{pulse}</style>
        </>
    );
}

export function SkeletonCard({ rows = 3 }) {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Skeleton height="1.25rem" width="60%" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} height="0.9rem" width={`${85 - i * 10}%`} />
            ))}
            <style>{pulse}</style>
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem' }}>
                {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} height="0.85rem" />)}
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem' }}>
                    {Array.from({ length: cols }).map((_, c) => <Skeleton key={c} height="0.85rem" width={`${70 + Math.random() * 30}%`} />)}
                </div>
            ))}
            <style>{pulse}</style>
        </div>
    );
}
