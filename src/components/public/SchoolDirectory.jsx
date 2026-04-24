"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import DataTable from '../ui/DataTable';
import { ArrowRight, Loader2 } from 'lucide-react';
import Topbar from '../layout/Topbar';
import ImageCarousel from '../ui/ImageCarousel';
import api from '../../services/axios';
import Link from 'next/link';

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

const SchoolDirectory = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/schools').then(r => setSchools(r.data)).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const columns = useMemo(() => [
        { header: 'School Name', key: 'name', render: (v) => <span style={{ fontWeight: 600, color: 'var(--accent-navy)' }}>{v}</span> },
        { header: 'District', key: 'district' },
        { header: 'Students', key: 'students' },
        { header: 'Teachers', key: 'teachers' },
        {
            header: 'Status', key: 'id',
            render: () => <Badge variant="success">Active</Badge>
        },
        {
            header: 'Action', key: 'id',
            render: (id) => (
                <Link href={`/schools/${id}`} className="btn btn-outline"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View <ArrowRight size={14} />
                </Link>
            )
        },
    ], []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf0', display: 'flex', flexDirection: 'column' }}>
            <Topbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--accent-navy)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            School <span className="text-gold">Directory</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Browse all 12 Zilla Parishad schools in Chhatrapati Sambhajinagar, Maharashtra.
                        </p>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <ImageCarousel images={indianSchoolImages} height="400px" autoPlayInterval={4500} />
                    </div>

                    <Card>
                        <CardHeader title={`Registered Institutions (${schools.length})`} />
                        <CardContent>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                    <Loader2 size={32} className="spinner" color="var(--accent-navy)" />
                                </div>
                            ) : (
                                <DataTable columns={columns} data={schools} searchable={true} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default SchoolDirectory;
