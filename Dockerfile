# 1. Base image : On utilise une version légère de Node.js
FROM node:20-alpine AS base

# 2. Dependencies : On installe les paquets
FROM base AS deps
WORKDIR /app

# On copie les fichiers de config
COPY package.json pnpm-lock.yaml* ./

# Installation de pnpm (car tu l'utilises)
RUN npm install -g pnpm

# Installation des dépendances
RUN pnpm i --frozen-lockfile

# 3. Builder : On construit le site
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Installation pnpm pour le build
RUN npm install -g pnpm

# --- 🛠️ CORRECTION CLOUDINARY ---
# On déclare qu'on attend un argument
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# On l'injecte dans l'environnement du build
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
# -------------------------------

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build_db"

# Génération du client Prisma (Important !)
RUN pnpm prisma generate

# Construction du projet Next.js
# Note: On désactive la télémétrie pour gagner du temps
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4. Runner : L'image finale qui ira sur le VPS
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Création d'un utilisateur système (sécurité)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# On copie uniquement les fichiers nécessaires depuis l'étape 'builder'
COPY --from=builder /app/public ./public

# On copie le mode "standalone" généré par Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# --- 🛠️ CORRECTIONS POUR PRISMA ---

# 1. On copie explicitement le dossier prisma (Schéma + Seed)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# 2. On installe ts-node et typescript globalement pour pouvoir lancer le seed
# (Car ils ont été supprimés du dossier node_modules optimisé)
RUN npm install -g ts-node typescript

# -----------------------------------

# On passe sur l'utilisateur sécurisé
USER nextjs

# On expose le port 3000
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]