import pool from './src/config/db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
    try {
        console.log('Initializing artists table...');
        const sqlPath = path.join(__dirname, 'scripts', 'init_artists.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const queries = sql.split(';').filter(q => q.trim().length > 0);

        for (const query of queries) {
            await pool.query(query);
            console.log('Executed query successfully.');
        }

        console.log('Artists table initialization completed.');
        process.exit(0);
    } catch (error) {
        console.error('Artists table initialization failed:', error);
        process.exit(1);
    }
}

init();
