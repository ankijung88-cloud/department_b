
const mysql = require('mysql2/promise');
require('dotenv').config();

const UPDATES = [
    { id: 1, url: 'https://images.unsplash.com/photo-1571932371459-a78b40813959?q=80&w=2560&auto=format&fit=crop' }, // 경복궁
    { id: 4, url: 'https://images.unsplash.com/photo-1543157145-c33589b25121?q=80&w=2560&auto=format&fit=crop' }, // 춘향
    { id: 6, url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2560&auto=format&fit=crop' }  // 달항아리
];

async function fixAllImages() {
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

        for (const update of UPDATES) {
            const [result] = await connection.execute(
                'UPDATE products SET image_url = ? WHERE id = ?',
                [update.url, update.id]
            );
            console.log(`Updated ID ${update.id}: ${result.affectedRows} row(s) affected.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

fixAllImages();
