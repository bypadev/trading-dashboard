import type { PriceUpdatePayload } from "@/types";
import { PriceUpdateSchema, WsMessageSchema } from "./schemas";
import {
  HEARTBEAT_MS,
  BASE_RECONNECT_MS,
  MAX_RECONNECT_ATTEMPTS,
  MAX_RECONNECT_DELAY_MS,
  WS_MESSAGE_TYPES,
} from "@/consts";

type PriceCallback = (payload: PriceUpdatePayload) => void;
type ConnectionCallback = (connected: boolean) => void;

function getWsUrl(token: string): string {
  const wsUrl = import.meta.env.VITE_WS_URL;
  if (wsUrl) return `${wsUrl}?token=${token}`;
  if (globalThis.location === undefined) {
    throw new TypeError('WebSocket URL cannot be resolved on the server');
  }
  const protocol = globalThis.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${globalThis.location.host}/ws?token=${token}`;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = true;
  private readonly priceCallbacks = new Set<PriceCallback>();
  private readonly connectionCallbacks = new Set<ConnectionCallback>();

  connect(token: string): void {
    this.token = token;
    this.shouldReconnect = true;
    if (
      this.ws?.readyState === WebSocket.OPEN ||
      this.ws?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }
    try {
      this.ws = new WebSocket(getWsUrl(token));
      this.attachHandlers();
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearTimers();
    this.ws?.close();
    this.ws = null;
    this.token = null;
  }

  onPriceUpdate(cb: PriceCallback): () => void {
    this.priceCallbacks.add(cb);
    return () => this.priceCallbacks.delete(cb);
  }

  onConnectionChange(cb: ConnectionCallback): () => void {
    this.connectionCallbacks.add(cb);
    return () => this.connectionCallbacks.delete(cb);
  }

  private attachHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.notifyConnection(true);
      this.startHeartbeat();
    };

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = WsMessageSchema.safeParse(JSON.parse(event.data));
        if (!msg.success) return;

        if (msg.data.type === WS_MESSAGE_TYPES.PRICE_UPDATE) {
          const parsed = PriceUpdateSchema.safeParse(msg.data.payload);
          if (parsed.success) {
            this.priceCallbacks.forEach((cb) => cb(parsed.data));
          }
        }
      } catch {
        // silently drop malformed frames
      }
    };

    this.ws.onclose = () => {
      this.clearTimers();
      this.notifyConnection(false);
      if (this.shouldReconnect) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    };
  }

  private scheduleReconnect(): void {
    const token = this.token;
    if (!token || this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
    const delay = Math.min(
      BASE_RECONNECT_MS * 1.5 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(token), delay);
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPES.PING,
            payload: { timestamp: Date.now() },
          }),
        );
      }
    }, HEARTBEAT_MS);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private notifyConnection(connected: boolean): void {
    this.connectionCallbacks.forEach((cb) => cb(connected));
  }
}

export const wsService = new WebSocketService();
