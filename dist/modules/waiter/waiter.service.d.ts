export declare const getPendingOrders: () => Promise<{
    order_id: any;
    table_number: any;
    customer_name: any;
    total_amount: number;
    placed_at: any;
    items: any;
}[]>;
export declare const confirmOrder: (orderId: string, finalItems?: any[]) => Promise<{
    id: string;
    restaurant_id: string;
    created_at: Date;
    table_id: string;
    kot_number: string | null;
    status: import("@prisma/client").$Enums.order_status;
    notes: string | null;
    total_amount: import("@prisma/client/runtime/library").Decimal;
    placed_at: Date;
    confirmed_at: Date | null;
    sent_to_kitchen_at: Date | null;
    ready_at: Date | null;
    served_at: Date | null;
    customer_session_id: string | null;
} | [import("@prisma/client").Prisma.BatchPayload, import("@prisma/client").Prisma.BatchPayload, {
    id: string;
    restaurant_id: string;
    created_at: Date;
    table_id: string;
    kot_number: string | null;
    status: import("@prisma/client").$Enums.order_status;
    notes: string | null;
    total_amount: import("@prisma/client/runtime/library").Decimal;
    placed_at: Date;
    confirmed_at: Date | null;
    sent_to_kitchen_at: Date | null;
    ready_at: Date | null;
    served_at: Date | null;
    customer_session_id: string | null;
}]>;
export declare const getReadyOrders: () => Promise<{
    order_id: any;
    kot_number: any;
    table_number: any;
}[]>;
export declare const getWaitersMenu: () => Promise<{
    id: string;
    name: string;
    price: import("@prisma/client/runtime/library").Decimal;
}[]>;
//# sourceMappingURL=waiter.service.d.ts.map