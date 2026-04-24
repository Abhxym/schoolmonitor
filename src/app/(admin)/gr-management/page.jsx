import React from 'react';
import FormBuilder from '../../../components/forms/FormBuilder';
export const metadata = { title: 'Forms & GR Management' };
export default function GRManagementPage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-navy)', marginBottom: '0.25rem' }}>Forms & GR Management</h1>
                <p style={{ color: '#718096' }}>Upload General Registers and deploy dynamic forms to Mukhyadhyapak portals.</p>
            </div>
            <FormBuilder />
        </div>
    );
}
