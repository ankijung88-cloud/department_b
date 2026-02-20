
const mysql = require('mysql2/promise');
require('dotenv').config();

const UPDATES = [
    { id: 1, url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gyeongbokgung_at_night.jpg/1280px-Gyeongbokgung_at_night.jpg' },
    { id: 4, url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pansori-02.jpg/1280px-Pansori-02.jpg' }
];

async function finalFix() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 15000
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

finalFix();
