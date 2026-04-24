import { useState, useEffect, useCallback } from 'react';
import { getAttendance, submitAttendance } from '../services/attendance.service';

export function useAttendance(params) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const paramKey = params ? JSON.stringify(params) : null;

    const fetch = useCallback(() => {
        setLoading(true);
        getAttendance(params || {})
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [paramKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (paramKey !== null || params === undefined) fetch();
        else setLoading(false);
    }, [fetch]); // eslint-disable-line react-hooks/exhaustive-deps

    const submit = async (payload) => {
        const record = await submitAttendance(payload);
        setData(prev => [...prev, record]);
        return record;
    };

    return { data, loading, error, submit, refetch: fetch };
}
