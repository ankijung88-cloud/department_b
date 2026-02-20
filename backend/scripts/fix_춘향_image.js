
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixChunhyangImage() {
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

        // Find the ID first to be sure
        const [rows] = await connection.execute('SELECT id FROM products WHERE name LIKE ?', ['%춘향%']);

        if (rows.length > 0) {
            const id = rows[0].id;
            // Update with a new high-quality image of traditional Korean performance
            const newImageUrl = 'https://images.unsplash.com/photo-1543157145-c33589b25121?q=80&w=2560&auto=format&fit=crop';
            const [result] = await connection.execute(
                'UPDATE products SET image_url = ? WHERE id = ?',
                [newImageUrl, id]
            );
            console.log(`Updated Chunhyang (ID: ${id}): ${result.affectedRows} row(s) affected.`);
        } else {
            console.log('Product "춘향" not found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

fixChunhyangImage();
