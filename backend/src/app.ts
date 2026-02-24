import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import artistRoutes from './routes/artistRoutes';
import goodsRoutes from './routes/goodsRoutes';
import orderRoutes from './routes/orderRoutes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/orders', orderRoutes);

// Translation Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend Server is Running', status: 'OK' });
});

app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Missing text or targetLang' });
        }

        const { translateText } = await import('./services/translationService');
        const translatedText = await translateText({ text, targetLang });
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation API Error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Handle Chrome DevTools discovery request to suppress 404 error
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(200).json({});
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Translation Service Ready`);

    // Auto-migration for database tables
    try {
        const pool = (await import('./config/db')).default;
        console.log('Running auto-migration for database tables...');

        // Artist bio column
        try {
            await pool.query('ALTER TABLE artists ADD COLUMN bio TEXT AFTER image_url');
            console.log('Migration: bio column added to artists successfully.');
        } catch (err: any) {
            if (err.code !== 'ER_DUP_COLUMN_NAME') throw err;
            console.log('Migration: bio column already exists in artists.');
        }

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
        console.log('Migration: goods table verified/created.');

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
        console.log('Migration: goods_orders table verified/created.');

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
        console.log('Migration: goods_order_items table verified/created.');

    } catch (error: any) {
        console.error('Migration error:', error.message);
    }
});

export default app;
