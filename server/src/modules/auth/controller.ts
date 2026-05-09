import type { FastifyInstance } from 'fastify';
import { LoginBodySchema } from './schemas';
import { login, logout } from './service';

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Login with username and password',
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              username: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (req, reply) => {
      const result = LoginBodySchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({ error: 'Invalid request body' });
      }
      const token = login(result.data.username, result.data.password);
      if (!token) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      return { token, username: result.data.username };
    },
  );

  app.post(
    '/auth/logout',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Invalidate the current token',
        response: { 204: { type: 'null' } },
      },
    },
    async (req, reply) => {
      const auth = req.headers.authorization;
      if (auth?.startsWith('Bearer ')) {
        logout(auth.slice(7));
      }
      return reply.status(204).send();
    },
  );
}
