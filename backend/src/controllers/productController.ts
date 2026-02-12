import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.category;

        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
        const params: any[] = [];

        if (categoryId) {
            query += ' WHERE p.category_id = ?';
            params.push(categoryId);
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
