# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN apk add --no-cache openssl
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN apk add --no-cache openssl
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Generate prisma client for production
RUN npx prisma generate

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Startup script to run migrations & start server
CMD npx prisma migrate deploy && node dist/server.js
