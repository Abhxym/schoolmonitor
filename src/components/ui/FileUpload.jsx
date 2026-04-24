"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileAccepted, accept, maxSize = 10485760, label = "Drag & drop files here" }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        if (onFileAccepted) {
            onFileAccepted(acceptedFiles);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxSize
    });

    const removeFile = (e, fileToRemove) => {
        e.stopPropagation();
        setFiles(files.filter(f => f !== fileToRemove));
    };

    return (
        <div className="file-upload-container">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
            >
                <input {...getInputProps()} />
                <UploadCloud size={48} className="dropzone-icon" />
                <p className="dropzone-text">{isDragActive ? 'Drop files now...' : label}</p>
                <p className="dropzone-subtext">or click to browse from your computer</p>
            </div>

            {files.length > 0 && (
                <div className="file-preview-list">
                    {files.map((file, idx) => (
                        <div key={idx} className="file-preview-item">
                            <div className="file-info">
                                <File size={20} className="text-navy" />
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button
                                type="button"
                                className="file-remove-btn"
                                onClick={(e) => removeFile(e, file)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
