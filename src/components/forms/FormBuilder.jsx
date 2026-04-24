"use client";
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import toast from 'react-hot-toast';
import { Plus, Save, Trash2, Upload, FileText, ExternalLink, Loader2 } from 'lucide-react';
import api from '../../services/axios';
import { getGRDocuments, uploadGRDocument, deleteGRDocument } from '../../services/gr.service';

const CATEGORIES = ['Academic', 'Administrative', 'Financial', 'Compliance', 'Safety', 'Welfare'];

const FormBuilder = () => {
    // GR Upload state
    const [docs, setDocs] = useState([]);
    const [docsLoading, setDocsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [grForm, setGrForm] = useState({ grNumber: '', title: '', category: 'Academic' });
    const [selectedFile, setSelectedFile] = useState(null);

    // Form builder state
    const [formFields, setFormFields] = useState([
        { id: 1, label: 'Student ID', type: 'text', required: true },
        { id: 2, label: 'Absence Reason', type: 'select', required: true },
    ]);

    useEffect(() => {
        getGRDocuments().then(setDocs).catch(() => {}).finally(() => setDocsLoading(false));
    }, []);

    const handleGRUpload = async (e) => {
        e.preventDefault();
        if (!grForm.grNumber || !grForm.title || !grForm.category)
            return toast.error('Fill in GR Number, Title and Category.');

        const formData = new FormData();
        formData.append('grNumber', grForm.grNumber);
        formData.append('title', grForm.title);
        formData.append('category', grForm.category);
        if (selectedFile) formData.append('file', selectedFile);

        setUploading(true);
        try {
            const doc = await uploadGRDocument(formData);
            setDocs(prev => [...prev, doc]);
            setGrForm({ grNumber: '', title: '', category: 'Academic' });
            setSelectedFile(null);
            toast.success('GR document uploaded to Cloudinary.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGRDocument(id);
            setDocs(prev => prev.filter(d => d._id !== id));
            toast.success('Document deleted.');
        } catch {
            toast.error('Delete failed.');
        }
    };

    const updateField = (id, key, value) =>
        setFormFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));

    const saveForm = async () => {
        if (formFields.length === 0) { toast.error('Add at least one field.'); return; }
        try {
            await api.post('/forms', { fields: formFields, deployedAt: new Date().toISOString() });
            toast.success('Form template deployed to Mukhyadhyapak portals.');
        } catch { toast.error('Deploy failed.'); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* GR Upload Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2rem' }}>
                <Card>
                    <CardHeader title="Upload GR Document" />
                    <CardContent>
                        <form onSubmit={handleGRUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>GR Number</label>
                                <input
                                    value={grForm.grNumber}
                                    onChange={e => setGrForm(p => ({ ...p, grNumber: e.target.value }))}
                                    placeholder="e.g. GR-2025-007"
                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Title</label>
                                <input
                                    value={grForm.title}
                                    onChange={e => setGrForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="Document title"
                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Category</label>
                                <select
                                    value={grForm.category}
                                    onChange={e => setGrForm(p => ({ ...p, category: e.target.value }))}
                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>
                                    File <span style={{ color: '#a0aec0', fontWeight: 400 }}>(PDF, DOC, XLS — optional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                                    onChange={e => setSelectedFile(e.target.files[0] || null)}
                                    style={{ width: '100%', fontSize: '0.9rem' }}
                                />
                                {selectedFile && (
                                    <p style={{ fontSize: '0.8rem', color: '#38a169', marginTop: '0.25rem' }}>
                                        ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                                    </p>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={uploading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {uploading ? <Loader2 size={18} className="spinner" /> : <Upload size={18} />}
                                {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
                            </button>
                        </form>
                    </CardContent>
                </Card>

                {/* Uploaded Documents List */}
                <Card>
                    <CardHeader title={`GR Documents (${docs.length})`} />
                    <CardContent>
                        {docsLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                <Loader2 size={28} className="spinner" color="var(--accent-navy)" />
                            </div>
                        ) : docs.length === 0 ? (
                            <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No documents uploaded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
                                {docs.map(doc => (
                                    <div key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <FileText size={20} color="var(--accent-navy)" style={{ flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {doc.grNumber} — {doc.title}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#718096' }}>{doc.category} · {doc.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            {doc.fileUrl && (
                                                <a href={doc.fileUrl} target="_blank" rel="noreferrer"
                                                    style={{ padding: '0.3rem', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', color: '#4a5568' }}
                                                    title="Open file">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button onClick={() => handleDelete(doc._id)}
                                                style={{ padding: '0.3rem', border: '1px solid #fed7d7', borderRadius: '4px', background: 'none', cursor: 'pointer', color: '#e53e3e', display: 'flex', alignItems: 'center' }}
                                                title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Form Builder Section */}
            <Card>
                <CardHeader
                    title="Mukhyadhyapak Form Builder"
                    action={
                        <button onClick={() => setFormFields(prev => [...prev, { id: Date.now(), label: 'New Field', type: 'text', required: false }])}
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Field
                        </button>
                    }
                />
                <CardContent>
                    <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Build forms that will be pushed to Mukhyadhyapak portals for daily reporting.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f7fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        {formFields.map((field, idx) => (
                            <div key={field.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #edf2f7' }}>
                                <div style={{ fontWeight: 600, color: '#a0aec0', width: '20px' }}>{idx + 1}.</div>
                                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" value={field.label}
                                        onChange={e => updateField(field.id, 'label', e.target.value)}
                                        style={{ flex: 2, padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-sans)' }}
                                        placeholder="Field Label" />
                                    <select value={field.type} onChange={e => updateField(field.id, 'type', e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '4px', outline: 'none' }}>
                                        <option value="text">Short Text</option>
                                        <option value="textarea">Long Text</option>
                                        <option value="number">Number</option>
                                        <option value="select">Dropdown</option>
                                    </select>
                                </div>
                                <button onClick={() => setFormFields(prev => prev.filter(f => f.id !== field.id))}
                                    style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '0.25rem' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {formFields.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0', fontStyle: 'italic' }}>
                                No fields defined. Add a field to start building.
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <button onClick={saveForm} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> Deploy Form
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default FormBuilder;
