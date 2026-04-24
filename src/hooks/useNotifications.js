import { useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '../services/notification.service';

export function useNotifications() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNotifications()
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const markRead = async (id) => {
        const updated = await markAsRead(id);
        setData(prev => prev.map(n => n.id === id ? updated : n));
    };

    const unreadCount = data.filter(n => !n.read).length;

    return { data, loading, unreadCount, markRead };
}
