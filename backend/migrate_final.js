const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const logFile = path.resolve(__dirname, 'migration_final.log');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'culture_store',
});

async function run() {
    log('--- Starting migration execution ---');
    try {
        const [rows] = await pool.query('ALTER TABLE artists ADD COLUMN user_id VARCHAR(255) AFTER image_url, ADD COLUMN bio TEXT AFTER user_id');
        log('SUCCESS: user_id and bio columns added.');
    } catch (e) {
        log('ERROR CODE: ' + e.code);
        log('ERROR MESSAGE: ' + e.message);
        if (e.code === 'ER_DUP_COLUMN_NAME') {
            log('Notice: Columns already exist.');
        }
    } finally {
        try {
            const [columns] = await pool.query('SHOW COLUMNS FROM artists');
            log('Current Columns: ' + columns.map(c => c.Field).join(', '));
        } catch (inner) {
            log('Failed to show columns: ' + inner.message);
        }
        log('--- Finished ---');
        process.exit();
    }
}

run();
