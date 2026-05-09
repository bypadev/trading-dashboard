import { z } from 'zod';

export const PricePointSchema = z.object({
  price: z.number().positive(),
  timestamp: z.number().int().positive(),
});

export const TickerParamSchema = z.object({
  ticker: z.string().min(1).max(20).transform((v) => v.toUpperCase()),
});

export const WsIncomingSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PING'),
    payload: z.unknown().optional(),
  }),
  z.object({
    type: z.literal('SUBSCRIBE'),
    payload: z.object({ symbol: z.string().min(1).max(20) }),
  }),
]);

export type WsIncoming = z.infer<typeof WsIncomingSchema>;
