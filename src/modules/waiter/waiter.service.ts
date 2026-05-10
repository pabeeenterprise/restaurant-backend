import { prisma } from '../../lib/prisma';

export const getPendingOrders = async () => {
  const orders = await prisma.order.findMany({
    where: { status: 'PENDING_CONFIRMATION' },
    include: {
      DiningTable: true,
      CustomerSession: true,
      OrderItem: true, // Keep this, but we'll add a safety net below
    },
    orderBy: { placed_at: 'asc' },
  });

  return orders.map((order: any) => {
    // SAFETY NET: This stops the 500 error if Prisma changes the relation name!
    const relatedItems = order.OrderItem || order.orderItems || [];

    return {
      order_id: order.id,
      table_number: order.DiningTable?.table_number || 'Unknown',
      customer_name: order.CustomerSession?.customer_name || 'Guest',
      total_amount: Number(order.total_amount) || 0,
      placed_at: order.placed_at,
      items: relatedItems.map((item: any) => ({
        menu_item_id: item.menu_item_id,
        name: item.item_name_snapshot,
        price: Number(item.item_price_snapshot) || 0,
        quantity: item.quantity,
        notes: item.item_notes || '',
      })),
    };
  });
};

export const confirmOrder = async (orderId: string, finalItems?: any[]) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  
  if (!order) throw new Error('Order not found');
  if (order.status !== 'PENDING_CONFIRMATION') {
    throw new Error('Order is not pending confirmation');
  }

  const count = await prisma.order.count({ where: { kot_number: { not: null } } });
  const kotNumber = `K${String(count + 1).padStart(3, '0')}`;

  // 1. If the waiter didn't make any edits, just confirm it normally
  if (!finalItems || finalItems.length === 0) {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SENT_TO_KITCHEN',
        kot_number: kotNumber,
        confirmed_at: new Date(),
        sent_to_kitchen_at: new Date(),
      },
    });
  }

  // 2. If edits WERE made, recalculate the total price
  let newTotal = 0;
  const newOrderItemsData = finalItems.map((item: any) => {
    const itemPrice = Number(item.price) || 0;
    newTotal += itemPrice * item.quantity;
    
    return {
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      item_name_snapshot: item.name,
      price_snapshot: itemPrice,     // <--- CHANGED THIS LINE!
      quantity: item.quantity,
      item_notes: item.notes || '',
    };
  });

  // 3. Perform a safe database transaction: Delete old items -> Insert new items -> Update Order
  return await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { order_id: orderId } }),
    prisma.orderItem.createMany({ data: newOrderItemsData }),
    prisma.order.update({
      where: { id: orderId },
      data: {
        total_amount: newTotal,
        status: 'SENT_TO_KITCHEN',
        kot_number: kotNumber,
        confirmed_at: new Date(),
        sent_to_kitchen_at: new Date(),
      },
    })
  ]);
};

export const editOrder = async (orderId: string, newItems: any[]) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { OrderItem: true, table: true },
  });

  if (!order) throw new Error('Order not found');

  await prisma.orderItem.deleteMany({ where: { order_id: orderId } });

  let total = 0;
  const newOrderItems = await Promise.all(
    newItems.map(async (item: any) => {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menu_item_id } });
      if (!menuItem) throw new Error(`Menu item ${item.menu_item_id} not found`);

      total += Number(menuItem.price) * item.quantity;
      return {
        menu_item_id: menuItem.id,
        item_name_snapshot: menuItem.name,
        price_snapshot: menuItem.price,
        quantity: item.quantity,
        item_notes: item.notes || null,
        station: menuItem.station,
      };
    })
  );

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      total_amount: total,
      OrderItem: { create: newOrderItems },
    },
    include: { OrderItem: true, table: true },
  });

  return updatedOrder;
};

// NEW: Fetch orders that the Kitchen has marked as READY
export const getReadyOrders = async () => {
  const orders = await prisma.order.findMany({
    where: { status: 'READY' },
    include: { DiningTable: true },
  });

  return orders.map((order: any) => ({
    order_id: order.id,
    kot_number: order.kot_number,
    table_number: order.DiningTable?.table_number || 'Unknown',
  }));
};

// NEW: Fetch the full menu for the Waiter to add items
export const getWaitersMenu = async () => {
  return await prisma.menuItem.findMany({
    select: { id: true, name: true, price: true }
  });
};