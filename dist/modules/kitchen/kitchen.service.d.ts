export declare const getActiveTickets: () => Promise<{
    order_id: any;
    kot_number: any;
    table_number: any;
    status: any;
    minutes_open: number;
    items: any;
}[]>;
export declare const markItemReady: (itemId: string) => Promise<{
    updatedItem: {
        id: string;
        created_at: Date;
        station: import("@prisma/client").$Enums.station_type;
        status: import("@prisma/client").$Enums.order_item_status;
        menu_item_id: string | null;
        item_name_snapshot: string;
        price_snapshot: import("@prisma/client/runtime/library").Decimal;
        quantity: number;
        item_notes: string | null;
        order_id: string;
    };
    allReady: boolean;
}>;
export declare const markOrderReady: (orderId: string) => Promise<{
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
}>;
//# sourceMappingURL=kitchen.service.d.ts.map