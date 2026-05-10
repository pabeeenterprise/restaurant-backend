import { Router } from 'express';
import { getPending, confirm, getReady, getMenu, editOrder } from './waiter.controller';

const router = Router();

router.get('/orders/pending', getPending);
router.patch('/orders/:id/confirm', confirm);
router.patch('/orders/:orderId/edit', editOrder);
router.get('/orders/ready', getReady); 
router.get('/menu', getMenu); 

export default router;