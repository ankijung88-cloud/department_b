const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'culture_store',
});

async function run() {
    try {
        console.log('Starting migration (JS)...');
        await pool.query('ALTER TABLE artists ADD COLUMN user_id VARCHAR(255) AFTER image_url, ADD COLUMN bio TEXT AFTER user_id');
        console.log('Migration successful: user_id and bio columns added.');
    } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Columns already exist, skipping migration.');
        } else {
            console.error('Migration failed:', e);
        }
    } finally {
        process.exit();
    }
}

run();
