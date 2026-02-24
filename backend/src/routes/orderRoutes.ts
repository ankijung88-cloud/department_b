import express from 'express';
import { createOrder, getOrders, getOrdersByUser, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders); // Admin: all orders
router.get('/user/:userId', getOrdersByUser); // User: specific user orders
router.put('/:id/status', updateOrderStatus); // Admin: update shipping status

export default router;
