import api from './client';
import { Order } from '../types';

export const createOrder = async (orderData: Partial<Order>): Promise<{ id: number }> => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get('/api/orders');
    return response.data;
};

export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
};

export const updateOrderStatus = async (id: number, shipping_status: Order['shipping_status']): Promise<void> => {
    await api.put(`/api/orders/${id}/status`, { shipping_status });
};
