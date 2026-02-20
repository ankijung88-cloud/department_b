
const mysql = require('mysql2/promise');

async function check() {
    // Using production settings from root .env
    const config = {
        host: '13.125.154.255',
        user: 'admin',
        password: 'admin123!',
        database: 'business_management',
    };

    console.log('Connecting to production:', config.host);

    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute("SHOW TABLES LIKE 'bookings'");

        if (rows.length > 0) {
            console.log('✅ Found: bookings table exists on production.');
        } else {
            console.log('❌ Not Found: bookings table does not exist on production.');
        }

        await connection.end();
    } catch (err) {
        console.error('Error connecting to remote DB:', err.message);
        console.log('Trying local fallback...');
        try {
            const localConfig = { ...config, host: 'localhost' };
            const conn2 = await mysql.createConnection(localConfig);
            const [rows2] = await conn2.execute("SHOW TABLES LIKE 'bookings'");
            if (rows2.length > 0) console.log('✅ Found: bookings table exists on localhost.');
            else console.log('❌ Not Found: bookings table does not exist on localhost.');
            await conn2.end();
        } catch (err2) {
            console.error('Local fallback failed:', err2.message);
        }
    }
}

check();
