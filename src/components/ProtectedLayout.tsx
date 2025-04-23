'use client';

import {ReactNode, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {logout} from '@/lib/auth';
import {useUser} from "@/hooks/useUser";

export default function ProtectedLayout({children,}: {
    children: ReactNode;
}) {
    const {user, loading} = useUser()
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
                Checking login status...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className="bg-white border-r space-y-8 px-4 py-10 shadow-md">
                <h1 className="text-3xl font-bold">Welcome back, <br/> {user.name} 👋</h1>
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role.name}</p>
                    <p><strong>Country:</strong> {user.country.name}</p>
                </div>

                <nav className="mt-6 space-y-3 text-sm">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="block text-left w-full text-blue-600 hover:underline"
                    >
                        🍽 Dashboard
                    </button>
                    <button
                        onClick={() => router.push('/orders')}
                        className="block text-left w-full text-blue-600 hover:underline"
                    >
                        🧾 Orders
                    </button>
                </nav>

                <button
                    onClick={async () => {
                        await logout();
                        router.push('/');
                    }}
                    className="text-red-600 text-sm hover:underline"
                >
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}