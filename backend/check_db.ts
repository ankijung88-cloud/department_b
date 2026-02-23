import pool from './src/config/db';

async function check() {
    try {
        const [rows]: any = await pool.query('DESCRIBE artists');
        console.log('Columns in artists table:');
        rows.forEach((row: any) => {
            console.log(`- ${row.Field}: ${row.Type}`);
        });
    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        process.exit();
    }
}

check();
