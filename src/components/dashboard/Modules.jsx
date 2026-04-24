"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Video, UserCheck, ShieldAlert, BarChart3, Clock, Unlock } from 'lucide-react';
import './Modules.css';

const moduleData = [
    {
        title: 'Attendance Tracking',
        description: 'Daily attendance submission and monitoring across all 12 cluster schools with analytics.',
        icon: <UserCheck size={32} />,
    },
    {
        title: 'GR Document Portal',
        description: 'Official Government Resolution upload, storage, and distribution via Cloudinary.',
        icon: <Video size={32} />,
    },
    {
        title: 'Event Management',
        description: 'School event registration with multi-level approval workflow and email notifications.',
        icon: <ShieldAlert size={32} />,
    },
    {
        title: 'Performance Analytics',
        description: 'Real-time dashboards with school-wise attendance rates, charts, and KPI tracking.',
        icon: <BarChart3 size={32} />,
    },
    {
        title: 'Report Submissions',
        description: 'Dynamic form-based reporting system for Mukhyadhyapak to submit to Kendrapramuk.',
        icon: <Clock size={32} />,
    },
    {
        title: 'Role-Based Access',
        description: 'Secure Kendrapramuk and Mukhyadhyapak portals with JWT authentication and RBAC.',
        icon: <Unlock size={32} />,
    }
];

const Modules = () => {
    return (
        <section className="modules section-padding" id="modules">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Core Capabilities</h2>
                    <p>A unified platform integrating every aspect of academy management and security.</p>
                </div>

                <div className="modules-grid">
                    {moduleData.map((mod, index) => (
                        <motion.div
                            key={index}
                            className="module-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="module-icon">
                                {mod.icon}
                            </div>
                            <h3 className="module-title">{mod.title}</h3>
                            <p className="module-desc">{mod.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Modules;
