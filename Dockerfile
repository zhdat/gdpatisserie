# 1. Base image : On utilise une version légère de Node.js
FROM node:20-alpine AS base

# 2. Dependencies : On installe les paquets
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN pnpm i --frozen-lockfile

# 3. Builder : On construit le site
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build_db"

RUN pnpm prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4. Runner : L'image finale qui ira sur le VPS
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

RUN npm install -g ts-node typescript

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]