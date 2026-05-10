import { Server } from 'socket.io';
export declare const getMenuByTableToken: (tableToken: string) => Promise<{
    table: {
        id: string;
        tableNumber: string;
        token: string;
    };
    restaurant: {
        id: string;
        name: string;
        slug: string | null;
    };
    categories: {
        id: string;
        name: string;
        description: string | null;
        items: {
            id: string;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            isVeg: boolean;
            isPopular: boolean;
            isNew: boolean;
            isAvailable: boolean;
            station: import("@prisma/client").$Enums.station_type;
            imageUrl: string | null;
        }[];
    }[];
}>;
export declare const startCustomerSession: (payload: {
    table_token: string;
    customer_name?: string;
    customer_phone?: string;
}) => Promise<{
    id: string;
    restaurant_id: string;
    is_active: boolean;
    created_at: Date;
    session_token: string;
    customer_name: string | null;
    customer_phone: string | null;
    table_id: string;
}>;
export declare const createOrder: (payload: {
    session_token: string;
    items: any[];
    notes?: string;
}) => Promise<{
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
export declare const emitOrderCreated: (io: Server, order: any) => void;
//# sourceMappingURL=public.service.d.ts.map