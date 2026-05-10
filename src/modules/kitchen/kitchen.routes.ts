import { Router } from 'express';
import { getTickets, itemReady, orderReady } from './kitchen.controller';

const router = Router();

router.get('/tickets/active', getTickets);
router.patch('/order-items/:itemId/ready', itemReady);
router.patch('/orders/:orderId/ready', orderReady); // <-- NEW ROUTE

export default router;