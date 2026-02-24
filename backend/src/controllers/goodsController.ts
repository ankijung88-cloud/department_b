import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getGoods = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM goods ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching goods:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGoodById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM goods WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Good not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching good by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createGood = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, image_url } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO goods (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock || 0, image_url]
        );

        res.status(201).json({ id: result.insertId, message: 'Good created successfully' });
    } catch (error) {
        console.error('Error creating good:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateGood = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url } = req.body;

        await pool.query(
            'UPDATE goods SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
            [name, description, price, stock, image_url, id]
        );

        res.json({ message: 'Good updated successfully' });
    } catch (error) {
        console.error('Error updating good:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteGood = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM goods WHERE id = ?', [id]);
        res.json({ message: 'Good deleted successfully' });
    } catch (error) {
        console.error('Error deleting good:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
