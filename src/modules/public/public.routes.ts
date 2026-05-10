import { Router } from 'express';
// Make sure placeOrder is imported here!
import { getMenu, startSession, placeOrder } from './public.controller';

const router = Router();

router.get('/menu', getMenu);
router.post('/session/start', startSession);
router.post('/orders', placeOrder); // <-- New route added

export default router;