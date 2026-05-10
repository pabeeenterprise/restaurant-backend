import { Request, Response } from 'express';
export declare const getPending: (req: Request, res: Response) => Promise<void>;
export declare const confirm: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getReady: (req: Request, res: Response) => Promise<void>;
export declare const getMenu: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=waiter.controller.d.ts.map