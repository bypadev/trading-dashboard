import { z } from 'zod';

export const PriceUpdateSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  previousPrice: z.number(),
  timestamp: z.number(),
  change: z.number(),
  changePercent: z.number(),
});

export const WsMessageSchema = z.object({
  type: z.string(),
  payload: z.unknown(),
});
