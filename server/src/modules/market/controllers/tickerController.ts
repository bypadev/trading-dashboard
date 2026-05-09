import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { priceRepository } from '../repositories/priceRepository';
import { TickerParamSchema } from '../schemas';
import { calcPriceChange } from '../utils';
import { tickerNotFoundMsg } from '../consts';

export const tickerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/tickers',
    {
      schema: {
        tags: ['Tickers'],
        summary: 'List all available tickers',
        response: {
          200: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.send(priceRepository.getTickers());
    },
  );

  fastify.get(
    '/tickers/:ticker',
    {
      schema: {
        tags: ['Tickers'],
        summary: 'Get current state for a ticker',
        params: {
          type: 'object',
          properties: { ticker: { type: 'string' } },
          required: ['ticker'],
        },
      },
    },
    async (req: FastifyRequest<{ Params: { ticker: string } }>, reply: FastifyReply) => {
      try {
        const { ticker } = TickerParamSchema.parse(req.params);
        const state = priceRepository.getState(ticker);

        if (!state) {
          return reply.status(404).send({ error: tickerNotFoundMsg(ticker) });
        }

        const { change, changePercent } = calcPriceChange(state.currentPrice, state.previousPrice);

        return reply.send({
          symbol: state.symbol,
          price: state.currentPrice,
          previousPrice: state.previousPrice,
          change,
          changePercent,
          timestamp: Date.now(),
        });
      } catch (err) {
        if (err instanceof ZodError) {
          return reply.status(400).send({ error: err.errors[0].message });
        }
        throw err;
      }
    },
  );

  fastify.get(
    '/history/:ticker',
    {
      schema: {
        tags: ['Tickers'],
        summary: 'Get price history for a ticker (last 100 data points)',
        params: {
          type: 'object',
          properties: { ticker: { type: 'string' } },
          required: ['ticker'],
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                price: { type: 'number' },
                timestamp: { type: 'number' },
              },
            },
          },
          404: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Params: { ticker: string } }>, reply: FastifyReply) => {
      try {
        const { ticker } = TickerParamSchema.parse(req.params);

        if (!priceRepository.getState(ticker)) {
          return reply.status(404).send({ error: tickerNotFoundMsg(ticker) });
        }

        return reply.send(priceRepository.getHistory(ticker));
      } catch (err) {
        if (err instanceof ZodError) {
          return reply.status(400).send({ error: err.errors[0].message });
        }
        throw err;
      }
    },
  );
};
