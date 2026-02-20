
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function check() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'admin123!',
        database: process.env.DB_NAME || 'business_management',
    };

    console.log('Connecting to:', config.host, 'DB:', config.database);

    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute("SHOW TABLES LIKE 'bookings'");

        if (rows.length > 0) {
            console.log('✅ Found: bookings table exists.');
        } else {
            console.log('❌ Not Found: bookings table does not exist.');
        }

        await connection.end();
    } catch (err) {
        console.error('Error connecting to DB:', err.message);
    }
}

check();
