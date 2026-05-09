# Trading Dashboard

A full-stack real-time trading dashboard that streams live price updates via WebSocket and displays interactive charts with price alerts.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Fastify](https://img.shields.io/badge/Fastify-4-black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Quick Start

```bash
docker compose up --build
```

| Service   | URL                          |
|-----------|------------------------------|
| Client    | http://localhost             |
| REST API  | http://localhost:3001/api    |
| Swagger   | http://localhost:3001/docs   |
| WebSocket | ws://localhost:3001/ws       |

**Demo credentials:**

| Username | Password     |
|----------|--------------|
| admin    | password123  |
| trader   | trading456   |

---

## Running Tests

```bash
# Server
cd server
npm install
npm test

# Client
cd client
npm install
npm test
```

---

## Local Development

**Server**
```bash
cd server
npm install
npm run dev        # http://localhost:3001, hot-reload via tsx watch
```

**Client**
```bash
cd client
npm install
npm run dev        # http://localhost:5173, proxies /api and /ws → :3001
```

**Tests**
```bash
cd server && npm test
cd client && npm test
```

---

## Project Structure

```
trading/
├── client/                        # React + Vite + MUI
│   └── src/
│       ├── components/
│       │   ├── PriceChart/        # Chart.js area/candlestick + alert line plugin
│       │   ├── TickerCard/        # Card with sub-components + styled
│       │   └── TickerList/        # Sidebar list + price alert panel
│       ├── pages/Dashboard/       # Layout + header
│       ├── hooks/                 # useWebSocket, useTickers, useTickerHistory
│       ├── services/              # WebSocketService class + Zod schemas
│       ├── store/                 # Zustand market store (tickers, alerts, notifications)
│       ├── consts/                # API_URL, WS config, regex, error strings
│       ├── types/                 # Shared TS types + AlertDirection enum
│       └── utils/                 # formatPrice, formatChange helpers
│
├── server/                        # Fastify + WebSocket
│   └── src/
│       ├── modules/market/
│       │   ├── controllers/       # REST route handlers
│       │   ├── services/          # MarketSimulator — random walk price engine
│       │   ├── repositories/      # PriceRepository — in-memory store
│       │   ├── websocket/         # wsHandler — broadcast + heartbeat
│       │   ├── schemas/           # Zod validation schemas
│       │   ├── consts/            # Tickers, error messages, WS routes
│       │   ├── enums/             # WsMessageType, ErrorCode
│       │   └── types/             # TickerState, PriceUpdatePayload, WsMessage
│       ├── shared/                # Pino logger
│       ├── config/                # Env validation
│       ├── app.ts                 # Fastify factory (CORS, Swagger, routes)
│       └── server.ts              # Entry point + graceful shutdown
│
├── k8s/                           # Kubernetes manifests
├── .github/workflows/ci.yml       # GitHub Actions — typecheck, test, Docker build
└── docker-compose.yml
```

---

## REST API

| Method | Endpoint                 | Description                        |
|--------|--------------------------|------------------------------------|
| POST   | `/api/auth/login`        | Login, returns `{ token, username }` |
| POST   | `/api/auth/logout`       | Invalidate token (`Authorization: Bearer <token>`) |
| GET    | `/health`                | Health check, uptime               |
| GET    | `/api/tickers`           | List all ticker symbols            |
| GET    | `/api/tickers/:ticker`   | Current price + change for ticker  |
| GET    | `/api/history/:ticker`   | Last 100 price points              |

Full OpenAPI docs at `http://localhost:3001/docs`.

---

## WebSocket Protocol

Connect to `ws://localhost:3001/ws`. The server broadcasts price updates every second to all connected clients.

**Server → Client (price update):**
```json
{
  "type": "PRICE_UPDATE",
  "payload": {
    "symbol": "BTC-USD",
    "price": 67341.82,
    "previousPrice": 67298.10,
    "change": 43.72,
    "changePercent": 0.065,
    "timestamp": 1746638830000
  }
}
```

**Client → Server (heartbeat ping):**
```json
{ "type": "PING", "payload": { "timestamp": 1746638830000 } }
```

**Server → Client (heartbeat pong):**
```json
{ "type": "PONG", "payload": { "timestamp": 1746638830001 } }
```

**Server → Client (error):**
```json
{ "type": "ERROR", "payload": { "message": "Invalid message format" } }
```

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Client    | React 18, TypeScript, Vite, MUI v5                      |
| Charts    | Chart.js 4 + react-chartjs-2 (area & candlestick)       |
| State     | Zustand                                                  |
| Data      | TanStack Query v5                                        |
| Schemas   | Zod                                                      |
| Server    | Fastify 4, TypeScript, tsx                              |
| WebSocket | `ws` library                                            |
| Logging   | Pino + pino-pretty                                      |
| Tests     | Vitest                                                  |
| Infra     | Docker, Docker Compose, Kubernetes, GitHub Actions      |

---

## Architecture Decisions

**Fastify over Express**
Built-in TypeScript support, schema-based validation that feeds directly into Swagger docs, and ~2× better throughput. The plugin system is also more structured.

**`ws` over Socket.IO**
Socket.IO adds reconnection, rooms, and namespaces — none of which are needed here. `ws` is the raw WebSocket library; keeping it thin means one fewer abstraction layer and easier debugging. Reconnection is handled client-side with exponential backoff.

**Zustand over Redux**
Redux requires actions, reducers, selectors, and a store — multiple files for a single feature slice. Zustand needs one file. Business logic (alert direction calculation, notification triggering) lives in store actions, not in components.

**Chart.js over Recharts**
Chart.js provides a canvas-based renderer which handles high-frequency updates (1 Hz across 6 tickers) without React reconciliation overhead. The `chartjs-chart-financial` plugin adds candlestick support with OHLC aggregation.

**TanStack Query for REST**
Handles caching, deduplication, and retry transparently. Historical data is fetched once per ticker selection and cached for 30 seconds.

---

## Trade-offs & Assumptions

- **No persistence** — Price history resets on server restart. A time-series DB (InfluxDB, TimescaleDB) would be the natural next step.
- **Mocked auth** — Credentials are hardcoded (`admin/password123`, `trader/trading456`). Tokens are UUID-based and stored in-memory; they reset on server restart. Production would use `@fastify/jwt` with a database.
- **No Redis** — In-memory store suffices for a single-instance demo. Redis pub/sub would enable horizontal scaling of WebSocket broadcasts.
- **Mock data only** — The simulator uses a random walk (±0.2% per tick). A real exchange feed (Binance WS, Alpaca) would be a drop-in replacement in `marketSimulator.ts`.
- **Broadcast to all** — All clients receive all ticker updates. Selective subscriptions are schema-validated but return an error — not needed when there are only 6 tickers.

---

## Features

- Mocked authentication — login/logout, token validated on WS handshake
- Live price updates via WebSocket at 1 Hz
- Area chart and candlestick chart (5-second OHLC buckets) with toggle
- Price alert system — set a threshold, get notified when price crosses it
- Exponential backoff reconnection (up to 10 attempts, max 30s delay)
- WebSocket heartbeat — server pings every 30s, client pings every 25s
- Swagger / OpenAPI docs at `/docs`
- Docker multi-stage builds with nginx reverse proxy for the client
- Kubernetes manifests with WebSocket-compatible ingress
- GitHub Actions CI — typecheck + test + Docker build + smoke test

---

## Available Tickers

`AAPL` · `TSLA` · `BTC-USD` · `ETH-USD` · `GOOGL` · `MSFT`
