FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY Server/package.json ./Server/
COPY client/package.json ./client/
RUN npm ci

COPY client/ ./client/
RUN cd client && npm run build

FROM nginx:alpine AS runner

RUN rm /etc/nginx/conf.d/default.conf
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
USER nodeuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
