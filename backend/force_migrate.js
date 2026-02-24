
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function migrate() {
    console.log('Starting manual migration...');
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log(`Connecting to database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);

        // Goods table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goods (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ goods table created/verified.');

        // Goods Orders table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goods_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                total_amount DECIMAL(10, 2) NOT NULL,
                payment_method ENUM('card', 'bank') NOT NULL,
                shipping_status ENUM('pending', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
                shipping_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ goods_orders table created/verified.');

        // Goods Order Items table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goods_order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                goods_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES goods_orders(id) ON DELETE CASCADE,
                FOREIGN KEY (goods_id) REFERENCES goods(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ goods_order_items table created/verified.');

        console.log('🚀 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await pool.end();
    }
}

migrate();
