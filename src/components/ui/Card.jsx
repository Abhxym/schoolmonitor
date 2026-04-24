import React from 'react';
import './Card.css';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
    return (
        <div className={`ui-card ${noPadding ? 'no-padding' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ title, action, className = '' }) => (
    <div className={`ui-card-header ${className}`}>
        <h3 className="ui-card-title">{title}</h3>
        {action && <div className="ui-card-action">{action}</div>}
    </div>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`ui-card-content ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`ui-card-footer ${className}`}>
        {children}
    </div>
);

export default Card;
