import { Server } from 'socket.io';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

// 1. MENU FETCH LOGIC
export const getMenuByTableToken = async (tableToken: string) => {
  const table = await prisma.diningTable.findUnique({
    where: { qr_token: tableToken },
    include: { Restaurant: true },
  });

  if (!table || !table.is_active || !table.Restaurant?.is_active) {
    throw new Error('Table not found or inactive');
  }

  const categories = await prisma.menuCategory.findMany({
    where: {
      restaurant_id: table.restaurant_id,
      is_active: true,
    },
    orderBy: { sort_order: 'asc' },
    include: {
      MenuItem: {
        where: { is_available: true },
        orderBy: { name: 'asc' },
      },
    },
  });

  return {
    table: {
      id: table.id,
      tableNumber: table.table_number,
      token: table.qr_token,
    },
    restaurant: {
      id: table.Restaurant.id,
      name: table.Restaurant.name,
      slug: table.Restaurant.slug,
    },
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      items: category.MenuItem.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        isVeg: item.is_veg,
        isPopular: item.is_popular,
        isNew: item.is_new,
        isAvailable: item.is_available,
        station: item.station,
        imageUrl: item.image_url,
      })),
    })),
  };
};

// 2. SESSION START LOGIC
export const startCustomerSession = async (payload: {
  table_token: string;
  customer_name?: string;
  customer_phone?: string;
}) => {
  if (!payload.table_token) {
    throw new Error('Table token was not provided to the service.');
  }

  const table = await prisma.diningTable.findUnique({
    where: { qr_token: payload.table_token },
    include: { Restaurant: true },
  });

  if (!table) throw new Error('Table not found in database');

  const sessionToken = crypto.randomBytes(24).toString('hex');
  return await prisma.customerSession.create({
    data: {
      restaurant_id: table.restaurant_id,
      table_id: table.id,
      session_token: sessionToken,
      // The fix: fallback to null instead of undefined
      customer_name: payload.customer_name || null,
      customer_phone: payload.customer_phone || null,
      is_active: true,
    },
  });
};

// 3. ORDER CREATION LOGIC
export const createOrder = async (payload: { session_token: string; items: any[]; notes?: string }) => {
  const session = await prisma.customerSession.findUnique({
    where: { session_token: payload.session_token },
  });

  if (!session || !session.is_active) throw new Error('Invalid session');

  let total = 0;
  const orderItemsData = await Promise.all(
    payload.items.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menu_item_id } });
      if (!menuItem) throw new Error(`Menu item not found`);

      const price = Number(menuItem.price);
      total += price * item.quantity;

      return {
        menu_item_id: menuItem.id,
        item_name_snapshot: menuItem.name,
        price_snapshot: price,
        quantity: item.quantity,
        // The fix is here: fallback to null instead of undefined
        item_notes: item.notes || null, 
        station: menuItem.station,
      };
    })
  );

  const newOrder = await prisma.order.create({
    data: {
      restaurant_id: session.restaurant_id,
      table_id: session.table_id,
      customer_session_id: session.id,
      total_amount: total,
      status: 'PENDING_CONFIRMATION',
      notes: payload.notes || null, 
      OrderItem: { create: orderItemsData },
    },
  });

  return newOrder;
};

// NEW: Socket event emitter (call from createOrder)
export const emitOrderCreated = (io: Server, order: any) => {
  const orderEvent = {
    id: order.id,
    table: order.table_token || 'T01',
    items_summary: order.OrderItem?.map((item: any) => `${item.item_name_snapshot} x${item.quantity}`).join(', ') || 'Items',
    time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    total: order.total_amount
  };
  
  io.to('waiter-room').emit('order.created', orderEvent);
  console.log('🔔 Emitted order.created:', orderEvent);
};