'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import api from '@/lib/axios';
import {toast} from "sonner";
import {User} from "@/types/user.types";
import {getCurrentUser} from "@/lib/auth";
import {useUser} from "@/hooks/useUser";


export default function HomePage() {
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
    const {user, loading} = useUser()

    const handleLogin = (email: string) => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
    };

    const getColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-600';
            case 'MANAGER':
                return 'bg-blue-600';
            case 'MEMBER':
                return 'bg-green-600';
            default:
                return 'bg-gray-600';
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (loading) return
            if (user) {
                router.push('/dashboard');
                toast.success('Welcome back!')
                return;
            }

            try {
                const res = await api.get('/');
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
                toast.error('Could not load users');
            }
        };

        checkAuth().then(() => console.log('Checking users'));
    }, [router, user, loading]);

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-20">
                🚀 Choose Your Hero to Login
            </h1>

            {loading ? (
                <p className="text-center text-gray-600">Loading users...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-5xl mx-auto">
                    {users.map((user) => (
                        <button
                            key={user.email}
                            onClick={() => handleLogin(user.email)}
                            className={`rounded-xl p-6 shadow-xl text-white transform transition hover:scale-105 cursor-pointer ${getColor(
                                user.role.name,
                            )}`}
                        >
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-white/80">{user.email}</p>
                            <div className="mt-3 flex justify-between text-sm opacity-90">
                                <span>🛡 {user.role.name}</span>
                                <span>🌍 {user.country.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </main>
    );
}