import pool from './src/config/db';

async function run() {
    try {
        console.log('Starting migration...');
        await pool.query('ALTER TABLE artists ADD COLUMN user_id VARCHAR(255) AFTER image_url, ADD COLUMN bio TEXT AFTER user_id');
        console.log('Migration successful: user_id and bio columns added to artists table.');
    } catch (e: any) {
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
