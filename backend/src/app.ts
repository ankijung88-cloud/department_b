import express from 'express';
import cors from 'cors';
import pool from './config/db';

import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Handle Chrome DevTools discovery request to suppress 404 error
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(200).json({});
});


// Check DB connection
pool.getConnection()
    .then((connection) => {
        console.log('✅ Connected to MySQL database');
        connection.release();
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
