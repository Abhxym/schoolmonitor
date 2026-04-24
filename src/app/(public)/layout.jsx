import React from 'react';
import Footer from '../../components/layout/Footer';

export default function PublicLayout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main style={{ flex: 1, backgroundColor: '#fcfaf0' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
