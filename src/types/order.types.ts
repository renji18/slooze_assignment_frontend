import {MenuItem} from "@/types/menu.types";

export type OrderItem = {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    itemTotal: number;
};

export type Order = {
    id: string;
    region: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
};