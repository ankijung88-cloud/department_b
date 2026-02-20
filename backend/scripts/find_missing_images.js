
const mysql = require('mysql2/promise');
require('dotenv').config();

async function findMissingImages() {
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
        const [rows] = await connection.execute('SELECT id, name, category_id, details FROM products WHERE image_url IS NULL OR image_url = ""');

        const fs = require('fs');
        let output = '--- PRODUCTS WITHOUT IMAGES ---\n';
        rows.forEach(r => {
            const details = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
            output += `ID: ${r.id} | Name: ${r.name} | Category: ${r.category_id} | Subcategory: ${details?.subcategory || 'N/A'}\n`;
        });
        output += '-------------------------\n';
        fs.writeFileSync('missing_images_report.txt', output);
        console.log('Report generated: missing_images_report.txt');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

findMissingImages();
