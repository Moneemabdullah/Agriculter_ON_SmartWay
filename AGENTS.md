# AGENTS.md

## Monorepo layout

npm workspaces: `Server/` (Express API, TypeScript) and `client/` (React + Vite).
`lib/` is Arduino/IoT (ESP32 firmware, not part of npm workspaces).

## Commands

| Package | Dev           | Build                       | Lint              | Test            |
|---------|---------------|-----------------------------|-------------------|-----------------|
| Server  | `npm run dev` | `npm run build`             | `npm run lint`    | `npm test`      |
| Client  | `npm run dev` | `npm run build`             | `npm run lint`    | `npm test`      |

Server dev uses `tsx watch ./src/server.ts`. Server build runs `rm -rf dist && tsc && cp -r src/public dist/public`.
Client test uses vitest (`npx vitest run`). No typecheck script exists.

## Environment (Server)

Loads `Server/.env` from project root. Key vars:
`CONNECTION_STRING` (MongoDB URI), `JWT_SECRET`, `PORT` (default 3000),
`CLOUDINARY_*`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

See `Server/.env.example`.

## Architecture

- Entry: `Server/src/server.ts` → `app.ts` → mounts routes at `/api/v1`
- Route groups: `/auth`, `/users`, `/crops`, `/sensors`, `/telemetry`, `/firms`, `/blogs`, `/admin`
- Each group follows `controller` / `service` / `route` / `model` pattern
- MongoDB: lazy singleton (`config/db.config.ts` — connects on first request, caches)
- Auth: JWT, `middlewares/auth.middleware.ts` — injects `req.user` and `req.userId` on Request
- Client dev server proxies `/api` → `http://localhost:3000` (`vite.config.js`)
- Logger: Winston, writes to `logs/` locally, console-only on Vercel

## Testing

- Server: Jest + ts-jest, matches `**/?(*.)+(spec|test).ts`
- Client: Vitest via `npx vitest run` (or `npm test`)
- Both have only placeholder smoke tests

## CI

`.github/workflows/ci.yml`: path-filtered (Server/ vs client/), Node 18, `npm ci`.
Order: lint → test → build. Server CI spins up `mongo:6` service container.
