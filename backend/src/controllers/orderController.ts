import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user_id, total_amount, payment_method, shipping_address, items } = req.body;

        // items should be [{ goods_id: 1, quantity: 2, price: 1000 }]

        // Use a transaction since we are inserting into multiple tables
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Create order
            const [orderResult] = await connection.query<ResultSetHeader>(
                'INSERT INTO goods_orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)',
                [user_id, total_amount, payment_method, shipping_address]
            );

            const orderId = orderResult.insertId;

            // 2. Insert order items and deduct stock
            for (const item of items) {
                await connection.query(
                    'INSERT INTO goods_order_items (order_id, goods_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.goods_id, item.quantity, item.price]
                );

                await connection.query(
                    'UPDATE goods SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.goods_id]
                );
            }

            await connection.commit();
            res.status(201).json({ id: orderId, message: 'Order created successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        // Fetch all orders with user info
        const [orders] = await pool.query<RowDataPacket[]>(`
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM goods_orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        // Fetch items for each order
        for (const order of orders) {
            const [items] = await pool.query<RowDataPacket[]>(`
                SELECT i.*, g.name as goods_name, g.image_url as goods_image 
                FROM goods_order_items i
                LEFT JOIN goods g ON i.goods_id = g.id
                WHERE i.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const [orders] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM goods_orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        for (const order of orders) {
            const [items] = await pool.query<RowDataPacket[]>(`
                SELECT i.*, g.name as goods_name, g.image_url as goods_image 
                FROM goods_order_items i
                LEFT JOIN goods g ON i.goods_id = g.id
                WHERE i.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { shipping_status } = req.body;
        // Valid status: 'pending', 'shipping', 'delivered', 'cancelled'

        await pool.query(
            'UPDATE goods_orders SET shipping_status = ? WHERE id = ?',
            [shipping_status, id]
        );

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
