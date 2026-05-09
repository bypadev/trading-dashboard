import { WebSocketServer, WebSocket } from 'ws';
import type { Server, IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import { marketSimulator } from '../services/marketSimulator';
import { WsIncomingSchema } from '../schemas';
import type { TickerState, WsMessage, PriceUpdatePayload } from '../types';
import { logger } from '../../../shared/logger';
import { calcPriceChange } from '../utils';
import { HEARTBEAT_INTERVAL_MS, WS_ROUTES, ERROR_MESSAGES } from '../consts';
import { WsMessageType, ErrorCode } from '../ts/enum';
import { isValidToken } from '../../auth/service';

type AliveSocket = WebSocket & { isAlive: boolean };

function buildPriceUpdate(state: TickerState): WsMessage<PriceUpdatePayload> {
  const { change, changePercent } = calcPriceChange(state.currentPrice, state.previousPrice);

  return {
    type: WsMessageType.PRICE_UPDATE,
    payload: {
      symbol: state.symbol,
      price: state.currentPrice,
      previousPrice: state.previousPrice,
      timestamp: Date.now(),
      change,
      changePercent,
    },
  };
}

export function setupWebSocket(server: Server): WebSocketServer {

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
    const url = new URL(request.url ?? '', 'http://localhost');
    if (url.pathname !== WS_ROUTES.MAIN) {
      socket.destroy();
      return;
    }
    const token = url.searchParams.get('token') ?? '';
    if (!isValidToken(token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  logger.info('WebSocket server attached at /ws');

  const unsubscribe = marketSimulator.onUpdate((state) => {
    const message = JSON.stringify(buildPriceUpdate(state));
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const clientIp = req.socket.remoteAddress;
    logger.info({ clientIp }, 'Client connected');

    const socket = ws as AliveSocket;
    socket.isAlive = true;

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    socket.on('message', (data, isBinary) => {
      if (isBinary) return;
      try {
        const text = Buffer.isBuffer(data)
          ? data.toString('utf8')
          : Buffer.concat(data as Buffer[]).toString('utf8');
        const raw = JSON.parse(text);
        const result = WsIncomingSchema.safeParse(raw);

        if (!result.success) {
          socket.send(
            JSON.stringify({ type: WsMessageType.ERROR, payload: { message: ERROR_MESSAGES[ErrorCode.INVALID_MESSAGE_FORMAT] } }),
          );
          return;
        }

        if (result.data.type === WsMessageType.PING) {
          socket.send(JSON.stringify({ type: WsMessageType.PONG, payload: { timestamp: Date.now() } }));
        } else if (result.data.type === WsMessageType.SUBSCRIBE) {
          socket.send(JSON.stringify({ type: WsMessageType.ERROR, payload: { message: ERROR_MESSAGES[ErrorCode.SUBSCRIBE_NOT_SUPPORTED] } }));
        }
      } catch {
        socket.send(JSON.stringify({ type: WsMessageType.ERROR, payload: { message: ERROR_MESSAGES[ErrorCode.INVALID_JSON] } }));
      }
    });

    socket.on('close', () => logger.info({ clientIp }, 'Client disconnected'));
    socket.on('error', (err) => logger.error({ err, clientIp }, 'WebSocket error'));
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      const socket = ws as AliveSocket;
      if (!socket.isAlive) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, HEARTBEAT_INTERVAL_MS);

  wss.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });

  return wss;
}
