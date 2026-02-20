import pool from '../src/config/db';
import { RowDataPacket } from 'mysql2';

async function dumpData() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT p.id, p.name, c.name as category_name, p.details FROM products p JOIN categories c ON p.category_id = c.id');
        console.log('--- PRODUCT DATA DUMP ---');
        rows.forEach(r => {
            const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
            console.log(`ID: ${r.id} | Name: ${r.name} | Category: ${r.category_name} | Subcategory: ${details?.subcategory || 'N/A'}`);
        });
        console.log('-------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error dumping data:', error);
        process.exit(1);
    }
}

dumpData();
