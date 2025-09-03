# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app


# ---------- Dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY src ./src
EXPOSE 4000
CMD ["npm", "run", "start:dev"]


# ---------- Prod deps ----------
FROM base AS deps
COPY package*.json ./
RUN npm ci


# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json nest-cli.json tsconfig*.json ./
COPY src ./src
RUN npm run build


# ---------- Runner ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main.js"]