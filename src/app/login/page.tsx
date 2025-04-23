'use client';

import {useSearchParams, useRouter} from 'next/navigation';
import {useEffect, useState, FormEvent} from 'react';
import api from '@/lib/axios';
import {toast} from 'sonner';
import {AxiosError} from "axios";
import {useUser} from "@/hooks/useUser";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {user, loading} = useUser()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/auth/login', {email, password});
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Login failed. Check your credentials.');
            }
        }
    };

    // Prefill email from ?email=...
    useEffect(() => {
        const prefillEmail = searchParams.get('email');
        if (prefillEmail) setEmail(prefillEmail);
    }, [searchParams]);

    useEffect(() => {
        const checkAuth = async () => {
            if (loading) return
            if (user) {
                router.push('/dashboard');
                return;
            }
        }

        checkAuth().then(() => toast.success('Welcome back!'));
    }, [router, user, loading]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl space-y-5 w-full max-w-sm"
            >
                <h1 className="text-3xl font-extrabold text-center text-gray-900">
                    🚪 Log In
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password is password123"
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Sign In
                </button>

                <p className="text-sm text-center text-gray-500">
                    Use one of the demo emails from the homepage.
                </p>
            </form>
        </div>
    );
}