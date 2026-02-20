
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateMissingImages() {
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

        // Update product ID 7 (팝업스토어 테스트)
        const [result] = await connection.execute(
            'UPDATE products SET image_url = ? WHERE id = ?',
            ['https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2560&auto=format&fit=crop', 7]
        );

        console.log(`Update result for ID 7: ${result.affectedRows} row(s) updated.`);

        // Also check if there are others and update with generic high-quality placeholders
        const [others] = await connection.execute('SELECT id, name FROM products WHERE image_url IS NULL OR image_url = ""');
        for (const row of others) {
            if (row.id !== 7) {
                await connection.execute(
                    'UPDATE products SET image_url = ? WHERE id = ?',
                    ['https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2560&auto=format&fit=crop', row.id]
                );
                console.log(`Updated ID ${row.id} (${row.name}) with generic image.`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

updateMissingImages();
