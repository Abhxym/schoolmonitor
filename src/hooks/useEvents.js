import { useState, useEffect, useCallback } from 'react';
import { getEvents, createEvent, updateEventStatus } from '../services/events.service';

export function useEvents(params) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const paramKey = params ? JSON.stringify(params) : '';

    const fetch = useCallback(() => {
        setLoading(true);
        getEvents(params || {})
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [paramKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetch(); }, [fetch]);

    const create = async (payload) => {
        const event = await createEvent(payload);
        setData(prev => [...prev, event]);
        return event;
    };

    const updateStatus = async (id, status) => {
        const updated = await updateEventStatus(id, status);
        setData(prev => prev.map(e => e.id === id ? updated : e));
        return updated;
    };

    return { data, loading, error, create, updateStatus, refetch: fetch };
}
