'use client';

import {useEffect, useState} from 'react';
import api from '@/lib/axios';
import ProtectedLayout from '@/components/ProtectedLayout';
import {toast} from 'sonner';
import {AxiosError} from "axios";
import {useUser} from "@/hooks/useUser";
import {Order} from "@/types/order.types";
import PaymentModal from "@/components/PaymentModal";


export default function OrdersPage() {
    const {user} = useUser()
    const [orders, setOrders] = useState<Order[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err: unknown) {
                if (err instanceof AxiosError && err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Failed to load orders');
                }
            }
        };

        fetchOrders().then(() => console.log('Fetched orders successfully'));
    }, []);

    const cancelOrder = async (id: string) => {
        try {
            await api.delete(`/orders/cancel/${id}`);
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? {...order, status: 'cancelled'} : order
                )
            );
            toast.success('Order cancelled');
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to cancel order');
            }
        }
    };

    const checkoutOrder = async (orderId: string, paymentMethodId: string) => {
        try {
            await api.post(`/orders/checkout/${orderId}`, {paymentMethodId});
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? {...order, status: 'paid'} : order
                )
            );
            toast.success('Order placed');
        } catch {
            toast.error('Checkout failed');
        }
    };

    if (!user) return null

    return (
        <ProtectedLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold mb-4">🧾 All Orders</h1>

                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders available.</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow p-4 space-y-2 border"
                        >
                            <div className="flex justify-between text-sm font-medium">
                                <span>🆔 {order.id}</span>
                                <span className="text-gray-500">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="text-sm flex flex-wrap gap-4">
                                <span>📍 Region: <b>{order.region}</b></span>
                                <span>💳 Status: <b className="capitalize">{order.status}</b></span>
                                <span>💰 Total: ₹{order.totalAmount}</span>
                            </div>

                            <div className="text-sm mt-2">
                                <p className="font-semibold">Items:</p>
                                <ul className="pl-4 list-disc text-gray-700">
                                    {order.items.map((item) => (
                                        <li key={item.id}>
                                            {item.menuItem.name} × {item.quantity} (
                                            ₹{item.itemTotal})
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {user.role.name !== "MEMBER" && order.status === 'pending' && (
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => cancelOrder(order.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrderId(order.id);
                                            setShowModal(true);
                                        }}
                                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {showModal && selectedOrderId && (
                    <PaymentModal
                        onCloseAction={() => setShowModal(false)}
                        onCheckoutAction={async (paymentMethodId) => {
                            await checkoutOrder(selectedOrderId, paymentMethodId)
                            setShowModal(false)
                        }}
                    />
                )}
            </div>
        </ProtectedLayout>
    );
}