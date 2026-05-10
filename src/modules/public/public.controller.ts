import { Request, Response } from 'express';
import * as publicService from './public.service';
import { Server } from 'socket.io';
import { io } from '../../server';


// Ensure 'export' is at the start of every function
export const getMenu = async (req: Request, res: Response) => {
    try {
        const tableToken = String(req.query.table_token || '').trim();
        const data = await publicService.getMenuByTableToken(tableToken);
        res.json({ success: true, ...data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const startSession = async (req: Request, res: Response) => {
    try {
        const session = await publicService.startCustomerSession(req.body);
        res.status(201).json({ success: true, session });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
    
};
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { session_token, items, notes } = req.body;

    if (!session_token || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'session_token and an array of items are required',
      });
    }

    const order = await publicService.createOrder({
      session_token,
      items,
      notes,
    });

    // 🔥 SAFE SOCKET EMIT
    const orderEvent = {
      id: order.id,
      table: 'T01', 
      items_summary: 'Customer order placed',
      time: new Date().toLocaleTimeString('en-IN'),
      total: Number(order.total_amount)
    };

    io.to('waiter-room').emit('order.created', orderEvent);
    console.log('🔔 SOCKET EMITTED:', orderEvent);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};