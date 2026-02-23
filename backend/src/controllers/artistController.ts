import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getArtists = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM artists';
        const params: any[] = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getArtistById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM artists WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching artist by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createArtist = async (req: Request, res: Response) => {
    try {
        const { name, title, image_url, bio } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO artists (name, title, image_url, bio) VALUES (?, ?, ?, ?)',
            [name, title, image_url, bio]
        );

        res.status(201).json({ id: result.insertId, message: 'Artist created successfully' });
    } catch (error: any) {
        console.error('Error creating artist:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, detail: error });
    }
};

export const updateArtist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, title, image_url, bio } = req.body;

        await pool.query(
            'UPDATE artists SET name = ?, title = ?, image_url = ?, bio = ? WHERE id = ?',
            [name, title, image_url, bio, id]
        );

        res.json({ message: 'Artist updated successfully' });
    } catch (error: any) {
        console.error('Error updating artist:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, detail: error });
    }
};

export const deleteArtist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM artists WHERE id = ?', [id]);
        res.json({ message: 'Artist deleted successfully' });
    } catch (error) {
        console.error('Error deleting artist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateArtistStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE artists SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.json({ message: 'Artist status updated successfully' });
    } catch (error) {
        console.error('Error updating artist status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
