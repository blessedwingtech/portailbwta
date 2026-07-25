# ==============================================================================
# BLESSED WING TECH ACADEMY (BWTA) - PORTAIL WEB & ESPACE EXÉCUTIF
# DOCKERFILE HAUTE PERFORMANCE & RÉSILIENCE - NODE 22 SLIM
# ==============================================================================

# ÉTAPE 1 : DÉPENDANCES ET GÉNÉRATION PRISMA
FROM node:22-slim AS deps
WORKDIR /app

# OpenSSL est requis pour Prisma Client sous Debian/Slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de configuration NPM / Lockfile
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Installation propre des dépendances et génération initiale de Prisma
RUN npm ci --quiet && npx prisma generate


# ÉTAPE 2 : COMPILATION DU PROJET NEXT.JS
FROM node:22-slim AS builder
WORKDIR /app

# Copie des dépendances générées à l'étape précédente
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Définition des variables de build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Optionnel pendant le build, permet au compilateur TS de ne pas échouer sur des URLs manquantes
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portailbwta"

# 1) Re-génère expressément le client Prisma après la copie du code (évite tout cache conflictuel)
# 2) Lance la compilation optimisée de l'application Next.js 16 (Turbopack)
RUN npx prisma generate && npm run build


# ÉTAPE 3 : IMAGE DE PRODUCTION ULTRA-LÉGÈRE (RUNNER)
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

# Copie exclusive des assets de production et des scripts de migration
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3002

# Au démarrage : synchronise les tables Postgres (sans altérer les données existantes),
# exécute le script de création du Président (seed) en toute sûreté, puis lance Next.js sur le port 3002.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run start -- --port 3002"]
