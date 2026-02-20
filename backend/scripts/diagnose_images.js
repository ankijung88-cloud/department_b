
const mysql = require('mysql2/promise');
require('dotenv').config();

async function diagnoseAndFix() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 10000
    };

    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [rows] = await connection.execute('SELECT id, name, image_url FROM products');

        console.log('--- Current Database State ---');
        for (const row of rows) {
            console.log(`ID: ${row.id} | Name: ${row.name} | Image: ${row.image_url}`);

            // Fix list
            let newUrl = null;
            if (row.id === 1) newUrl = 'https://images.unsplash.com/photo-1571932371459-a78b40813959?q=80&w=2560&auto=format&fit=crop';
            if (row.id === 4) newUrl = 'https://images.unsplash.com/photo-1543157145-c33589b25121?q=80&w=2560&auto=format&fit=crop';
            if (row.id === 7) newUrl = 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2560&auto=format&fit=crop';

            // Case for broken old URLs or empty ones
            if (row.image_url && row.image_url.includes('photo-1514533248912-c96053de8a94')) {
                newUrl = 'https://images.unsplash.com/photo-1543157145-c33589b25121?q=80&w=2560&auto=format&fit=crop';
            }

            if (newUrl) {
                await connection.execute('UPDATE products SET image_url = ? WHERE id = ?', [newUrl, row.id]);
                console.log(`  -> UPDATED ID ${row.id} to ${newUrl}`);
            }
        }

        console.log('--- Fix Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

diagnoseAndFix();
