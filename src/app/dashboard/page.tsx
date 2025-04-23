'use client';

import ProtectedLayout from "@/components/ProtectedLayout";
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {Restaurant} from "@/types/restaurant.types";
import {CartItem} from "@/types/cart.types";
import {MenuItem} from "@/types/menu.types";
import {toast} from "sonner";
import {AxiosError} from "axios";


export default function DashboardPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selected, setSelected] = useState<Restaurant | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await api.get('/restaurants');
                setRestaurants(res.data);
            } catch (err: unknown) {
                if (err instanceof AxiosError && err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Failed to load restaurants');
                }
            }
        };
        fetchRestaurants().then(() => console.log('Fetched restaurants successfully'));
    }, []);

    const updateCart = (item: MenuItem, delta: number) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.menuItemId === item.id);
            if (existing) {
                const updatedQty = existing.quantity + delta;
                if (updatedQty <= 0) {
                    return prev.filter((i) => i.menuItemId !== item.id);
                }
                return prev.map((i) =>
                    i.menuItemId === item.id ? {...i, quantity: updatedQty} : i
                );
            } else if (delta > 0) {
                return [...prev, {menuItemId: item.id, name: item.name, price: item.price, quantity: 1}];
            }
            return prev;
        });
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        try {
            await api.post('/orders/create', {
                items: cart.map((item) => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                })),
            });

            toast.success('Order placed successfully!');
            setCart([]);
        } catch (err) {
            console.error(err);
            toast.error('Failed to place order');
        }
    };

    return (
        <ProtectedLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* Restaurants */}
                <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-4">🍽 Restaurants</h2>
                    <ul className="space-y-3">
                        {restaurants.map((r) => (
                            <li key={r.id}>
                                <button
                                    onClick={() => setSelected(r)}
                                    className={`w-full text-left p-4 rounded-xl shadow-sm border hover:bg-gray-200 transition ${
                                        selected?.id === r.id ? 'bg-gray-300 font-semibold' : 'bg-white'
                                    }`}
                                >
                                    {r.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Menu */}
                <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        🍛 Menu {selected ? `— ${selected.name}` : ''}
                    </h2>

                    {selected ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selected.menuItems.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => updateCart(item, 1)}
                                    className="p-4 bg-white rounded-lg shadow-sm space-y-2"
                                >
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">₹{item.price}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Select a restaurant to view its menu.</p>
                    )}
                </div>
            </div>

            {/* Cart */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 w-80 bg-white border shadow-lg rounded-xl p-4 space-y-3 z-50">
                    <h3 className="text-lg font-bold">🛒 Your Cart</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {cart.map((item) => (
                            <li
                                key={item.menuItemId}
                                className="flex justify-between items-center text-sm"
                            >
                                <div>
                                    {item.name} x {item.quantity}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => updateCart({...item, id: item.menuItemId}, -1)}
                                        className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        –
                                    </button>
                                    <button
                                        onClick={() => updateCart({...item, id: item.menuItemId}, 1)}
                                        className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total:</span>
                        <span>
                          ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                        </span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700"
                    >
                        Place Order
                    </button>
                </div>
            )}
        </ProtectedLayout>
    );
}