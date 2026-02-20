
import pool from '../src/config/db';
import { RowDataPacket } from 'mysql2';

async function findMissingImages() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, image_url, details FROM products WHERE image_url IS NULL OR image_url = ""');
        console.log('--- PRODUCTS WITHOUT IMAGES ---');
        rows.forEach(r => {
            const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
            console.log(`ID: ${r.id} | Name: ${r.name} | Category: ${r.category_id} | Subcategory: ${details?.subcategory || 'N/A'}`);
        });
        console.log('-------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

findMissingImages();
