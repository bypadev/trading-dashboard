import { z } from 'zod';

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

