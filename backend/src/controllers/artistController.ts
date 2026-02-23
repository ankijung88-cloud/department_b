import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getArtists = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM artists ORDER BY created_at DESC');
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
        const { name, title, image_url } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO artists (name, title, image_url) VALUES (?, ?, ?)',
            [name, title, image_url]
        );

        res.status(201).json({ id: result.insertId, message: 'Artist created successfully' });
    } catch (error) {
        console.error('Error creating artist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateArtist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, title, image_url } = req.body;

        await pool.query(
            'UPDATE artists SET name = ?, title = ?, image_url = ? WHERE id = ?',
            [name, title, image_url, id]
        );

        res.json({ message: 'Artist updated successfully' });
    } catch (error) {
        console.error('Error updating artist:', error);
        res.status(500).json({ message: 'Server error' });
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
