FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY Server/package.json ./Server/
COPY client/package.json ./client/
RUN npm ci

COPY Server/tsconfig.json ./Server/
COPY Server/src ./Server/src
RUN cd Server && npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tini

COPY package.json package-lock.json* ./
COPY Server/package.json ./Server/
COPY client/package.json ./client/
RUN npm ci --omit=dev

COPY --from=builder /app/Server/dist ./Server/dist

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
USER nodeuser

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/Server

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
