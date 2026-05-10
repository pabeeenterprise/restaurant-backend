"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOrderReady = exports.markItemReady = exports.getActiveTickets = void 0;
const prisma_1 = require("../../lib/prisma");
// 1. Fetch active tickets for the kitchen
const getActiveTickets = async () => {
    const activeOrders = await prisma_1.prisma.order.findMany({
        where: {
            status: {
                in: ['SENT_TO_KITCHEN', 'READY'], // Chef only needs to see active ones
            },
        },
        include: {
            DiningTable: true,
            OrderItem: true,
        },
        orderBy: { confirmed_at: 'asc' },
    });
    return activeOrders.map((order) => {
        // SAFETY NET for Prisma relation names
        const relatedItems = order.OrderItem || order.orderItems || [];
        return {
            order_id: order.id, // <-- ADDED THIS: The frontend needs this ID!
            kot_number: order.kot_number,
            table_number: order.DiningTable?.table_number || 'Unknown',
            status: order.status,
            minutes_open: order.confirmed_at
                ? Math.round((new Date().getTime() - new Date(order.confirmed_at).getTime()) / 60000)
                : 0,
            items: relatedItems.map((item) => ({
                item_id: item.id,
                name: item.item_name_snapshot,
                quantity: item.quantity,
                notes: item.item_notes,
                status: item.status,
            })),
        };
    });
};
exports.getActiveTickets = getActiveTickets;
// 2. Mark an individual item as 'READY'
const markItemReady = async (itemId) => {
    const updatedItem = await prisma_1.prisma.orderItem.update({
        where: { id: itemId },
        data: { status: 'READY' },
    });
    const orderId = updatedItem.order_id;
    const allItems = await prisma_1.prisma.orderItem.findMany({
        where: { order_id: orderId },
    });
    const allReady = allItems.every((item) => item.status === 'READY');
    if (allReady) {
        await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status: 'READY', ready_at: new Date() },
        });
    }
    return { updatedItem, allReady };
};
exports.markItemReady = markItemReady;
// 3. NEW: Mark the ENTIRE order as 'READY' at once
const markOrderReady = async (orderId) => {
    // First, mark all items inside the order as ready
    await prisma_1.prisma.orderItem.updateMany({
        where: { order_id: orderId },
        data: { status: 'READY' },
    });
    // Then, mark the main order as ready for the Waiter to pick up
    return await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'READY',
            ready_at: new Date(),
        },
    });
};
exports.markOrderReady = markOrderReady;
//# sourceMappingURL=kitchen.service.js.map