'use client';

import {useEffect, useState} from 'react';
import api from '@/lib/axios';
import {toast} from 'sonner';
import {PaymentMethod} from "@/types/payment.types";
import {useUser} from "@/hooks/useUser";


export default function PaymentModal({onCloseAction, onCheckoutAction,}: {
    onCloseAction: () => void; onCheckoutAction: (paymentMethodId: string) => void;
}) {
    const {user} = useUser()

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMethod, setNewMethod] = useState('');

    const addPaymentMethod = async () => {
        if (!newMethod.trim()) return;
        try {
            const res = await api.post('/payment', {method: newMethod});
            setPaymentMethods((prev) => [...prev, res.data]);
            toast.success('Payment method added');
            setNewMethod('');
        } catch {
            toast.error('Failed to add payment method');
        }
    };

    const deletePaymentMethod = async (id: string) => {
        try {
            await api.delete(`/payment/${id}`);
            setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
            toast.success('Payment method deleted');
        } catch {
            toast.error('Failed to delete payment method');
        }
    };

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const res = await api.get('/payment');
                setPaymentMethods(res.data);
            } catch {
                toast.error('Failed to load payment methods');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentMethods().then(() => console.log('Fetched payment methods successfully'));
    }, []);

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold">Select Payment Method</h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {paymentMethods.map((method) => (
                            <div key={method.id}
                                 className="flex items-center justify-between bg-blue-100 rounded px-4 py-2">
                                <button
                                    onClick={() => onCheckoutAction(method.id)}
                                    className="text-left w-full hover:underline cursor-pointer"
                                >
                                    {method.method}
                                </button>
                                {user.role.name === "ADMIN" && <button
                                    onClick={() => deletePaymentMethod(method.id)}
                                    className="text-red-600 text-xs ml-4 hover:underline cursor-pointer"
                                >
                                    Delete
                                </button>}
                            </div>
                        ))}
                    </div>
                )}

                {user.role.name === "ADMIN" && <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={newMethod}
                        onChange={(e) => setNewMethod(e.target.value)}
                        placeholder="New payment method"
                        className="border px-3 py-1 rounded w-full"
                    />
                    <button
                        onClick={addPaymentMethod}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>}

                <button
                    onClick={onCloseAction}
                    className="text-sm text-gray-600 hover:underline block mt-2 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}