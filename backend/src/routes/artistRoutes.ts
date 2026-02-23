import { Router } from 'express';
import * as artistController from '../controllers/artistController';

const router = Router();

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.createArtist);
router.put('/:id', artistController.updateArtist);
router.patch('/:id/status', artistController.updateArtistStatus);
router.delete('/:id', artistController.deleteArtist);

export default router;
