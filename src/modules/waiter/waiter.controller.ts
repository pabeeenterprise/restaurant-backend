import { Request, Response } from 'express';
import { io } from '../../server';
import * as waiterService from './waiter.service';

export const getPending = async (req: Request, res: Response) => {
  try {
    const orders = await waiterService.getPendingOrders();
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { items } = req.body; 

    if (!id) return res.status(400).json({ success: false, message: 'id is required' });

    // FIX: Using String(id) guarantees TypeScript this will only ever be one string!
    const order = await waiterService.confirmOrder(String(id), items);
    
    res.json({ success: true, message: 'Order sent to kitchen', order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const editOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;

    if (!orderId || Array.isArray(orderId)) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const updatedOrder: any = await waiterService.editOrder(orderId, items);

    io.to('waiter-room').emit('order.updated', {
      id: updatedOrder.id,
      table: updatedOrder.table?.qr_token || 'T01',
      items_summary:
        updatedOrder.OrderItem?.map((item: any) => `${item.item_name_snapshot} x${item.quantity}`).join(', ') ||
        'Updated order',
      time: new Date().toLocaleTimeString('en-IN'),
      total: Number(updatedOrder.total_amount),
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// NEW: Controller for fetching ready orders
export const getReady = async (req: Request, res: Response) => {
  try {
    const orders = await waiterService.getReadyOrders();
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: Controller for the Waiter Menu
export const getMenu = async (req: Request, res: Response) => {
  try {
    const menu = await waiterService.getWaitersMenu();
    res.json({ success: true, menu });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};