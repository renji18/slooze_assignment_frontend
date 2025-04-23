'use client';

import {useEffect, useState} from 'react';
import {getCurrentUser} from '@/lib/auth';
import {User} from '@/types/user.types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getCurrentUser();
            setUser(data);
            setLoading(false);
        };

        fetchUser().then(() => console.log("User fetched successfully."));
    }, []);

    return {user, loading};
}