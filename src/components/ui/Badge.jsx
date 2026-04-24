import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'default', className = '' }) => {
    // variants: 'default', 'success', 'warning', 'danger', 'info'
    return (
        <span className={`ui-badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
