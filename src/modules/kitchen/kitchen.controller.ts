import { Request, Response } from 'express';
import * as kitchenService from './kitchen.service';

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await kitchenService.getActiveTickets();
    res.json({ success: true, tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const itemReady = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const result = await kitchenService.markItemReady(String(itemId));
    res.json({ success: true, message: 'Item marked as ready', result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// NEW: Controller for the whole order
export const orderReady = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await kitchenService.markOrderReady(String(orderId));
    res.json({ success: true, message: 'Entire order marked as ready to serve!', result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};