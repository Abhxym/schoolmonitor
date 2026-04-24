"use client";
import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ columns, data, searchable = true, pageSize = 10 }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
        }));
        setPage(1);
    };

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item =>
            Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [data, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageData = sortedData.slice((safePage - 1) * pageSize, safePage * pageSize);

    return (
        <div className="data-table-container">
            {searchable && (
                <div className="data-table-actions">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="search-input"
                        />
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="ui-data-table">
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={`${col.key}-${i}`}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={col.sortable !== false ? 'sortable' : ''}>
                                    <div className="th-content">
                                        {col.header}
                                        {col.sortable !== false && (
                                            <span className="sort-icon">
                                                {sortConfig.key === col.key
                                                    ? sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                                    : <ArrowUpDown size={14} className="text-muted" />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? (
                            pageData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <td key={`${rowIndex}-${colIndex}`}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center no-data">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="data-table-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Showing {pageData.length} of {sortedData.length} records</span>
                {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: safePage === 1 ? 'not-allowed' : 'pointer', opacity: safePage === 1 ? 0.4 : 1 }}>
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                            .reduce((acc, p, i, arr) => {
                                if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) => p === '...'
                                ? <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: '#a0aec0' }}>…</span>
                                : <button key={p} onClick={() => setPage(p)}
                                    style={{ minWidth: '32px', padding: '0.25rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', backgroundColor: safePage === p ? 'var(--accent-navy)' : 'white', color: safePage === p ? 'white' : '#4a5568', fontWeight: safePage === p ? 700 : 400 }}>
                                    {p}
                                  </button>
                            )}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1 }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
