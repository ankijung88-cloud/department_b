import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../api/orders';
import { Order } from '../../types';

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: number, newStatus: Order['shipping_status']) => {
        try {
            await updateOrderStatus(id, newStatus);
            setOrders(orders.map(o => o.id === id ? { ...o, shipping_status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white font-serif">Order Management</h1>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-white/80 text-sm">
                    <thead className="bg-white/5 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User Info</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Address</th>
                            <th className="p-4 text-right">Status / Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium">#{order.id}</td>
                                <td className="p-4">
                                    <div className="font-bold">{order.user_name}</div>
                                    <div className="text-xs text-white/50">{order.user_email}</div>
                                </td>
                                <td className="p-4">
                                    <ul className="list-disc pl-4">
                                        {order.items?.map(item => (
                                            <li key={item.id}>{item.goods_name} x {item.quantity}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-4 font-bold text-dancheong-red">
                                    {Number(order.total_amount).toLocaleString()}원
                                </td>
                                <td className="p-4 max-w-xs truncate text-xs" title={order.shipping_address}>
                                    {order.shipping_address}
                                </td>
                                <td className="p-4 text-right">
                                    <select
                                        value={order.shipping_status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['shipping_status'])}
                                        className={`bg-black/40 border border-white/20 rounded p-2 text-white text-xs outline-none focus:border-dancheong-red ${order.shipping_status === 'pending' ? 'text-yellow-400' :
                                            order.shipping_status === 'shipping' ? 'text-blue-400' :
                                                order.shipping_status === 'delivered' ? 'text-green-400' :
                                                    'text-red-400'
                                            }`}
                                    >
                                        <option value="pending" className="text-white">배송대기</option>
                                        <option value="shipping" className="text-white">배송중</option>
                                        <option value="delivered" className="text-white">배송완료</option>
                                        <option value="cancelled" className="text-white">취소</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/40">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
