import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, name AS full_name, email, UPPER(role) AS role, created_at, NULL AS avatar_url FROM users ORDER BY role ASC, name ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (role !== 'ADMIN' && role !== 'USER') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // In a real app, you might want to handle cascading deletes or soft deletes
        // For now, we'll just delete the user.
        await pool.query('DELETE FROM users WHERE id = ?', [id]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
