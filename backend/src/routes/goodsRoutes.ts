import express from 'express';
import { getGoods, getGoodById, createGood, updateGood, deleteGood } from '../controllers/goodsController';

const router = express.Router();

router.get('/', getGoods);
router.get('/:id', getGoodById);
// Note: In a real app we'd add admin auth middleware to POST/PUT/DELETE
router.post('/', createGood);
router.put('/:id', updateGood);
router.delete('/:id', deleteGood);

export default router;
